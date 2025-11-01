import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function LoginDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      alert("Login gagal: " + error.message);
      setLoading(false);
      return;
    }

    // Ambil data dokter dari tabel doctors berdasarkan email
    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("*")
      .eq("email", form.email)
      .single();

    if (doctorError) {
      alert("Gagal ambil data dokter: " + doctorError.message);
      setLoading(false);
      return;
    }

    // Simpan sesi login + data dokter
    localStorage.setItem("supabaseSession", JSON.stringify(data.session));
    localStorage.setItem("doctorData", JSON.stringify(doctorData));

    alert("Login berhasil!");
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600">
          Login Dokter
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-700 text-white font-semibold py-2 rounded"
        >
          {loading ? "Memproses..." : "Login"}
        </button>

        <p className="text-center text-sm mt-2">
          Belum punya akun?{" "}
          <Link to="/register" className="text-pink-600 hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
