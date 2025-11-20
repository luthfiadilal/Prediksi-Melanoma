import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function LoginDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    // 1. Proses Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setNotification({
        type: "error",
        title: "Login Gagal",
        message: error.message, // Pesan error dari Supabase
      });
      setLoading(false);
      return;
    }

    // 2. Ambil data dokter
    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("*")
      .eq("email", form.email)
      .single();

    if (doctorError) {
      setNotification({
        type: "error",
        title: "Akun Tidak Ditemukan",
        message: "Data dokter tidak tersedia.",
      });
      setLoading(false);
      return;
    }

    // 3. Simpan sesi
    localStorage.setItem("supabaseSession", JSON.stringify(data.session));
    localStorage.setItem("doctorData", JSON.stringify(doctorData));

    // 4. SUKSES
    setNotification({
      type: "success",
      title: "Login Berhasil",
      message: "Selamat datang kembali, Dok!",
    });

    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 relative overflow-hidden">
      {/* --- CSS Animasi Custom untuk Notifikasi --- */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* --- KOMPONEN NOTIFIKASI ESTETIK --- */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div
            className={`
            flex items-start gap-4 px-6 py-4 
            bg-white rounded-xl shadow-2xl 
            border-l-4 max-w-sm w-full
            ${
              notification.type === "success"
                ? "border-emerald-500"
                : "border-rose-500"
            }
          `}
          >
            {/* Ikon SVG */}
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            {/* Teks Notifikasi */}
            <div className="flex-1">
              <h3
                className={`font-bold text-sm ${
                  notification.type === "success"
                    ? "text-emerald-800"
                    : "text-rose-800"
                }`}
              >
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>

            {/* Tombol Close Kecil (Opsional) */}
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- FORM LOGIN --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-6 border border-gray-100"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Halo, Dokter!
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Silakan masuk ke akun Anda
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="dokter@example.com"
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-3 rounded-lg text-white shadow-lg transform transition-all duration-200 active:scale-95 ${
            loading
              ? "bg-pink-300 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:shadow-pink-500/30"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            </span>
          ) : (
            "Masuk Sekarang"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
          >
            Daftar disini
          </Link>
        </p>
      </form>
    </div>
  );
}
