import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeartPulse, BookOpen, Sun, Microscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { supabase } from "../../services/supabaseClient";

export default function About({
  doctor: propDoctor,
  handleLogout: propLogout,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [doctor, setDoctor] = useState(
    propDoctor || JSON.parse(localStorage.getItem("doctorData"))
  );

  // ✅ handle logout (fallback kalau tidak dikirim dari parent)
  const handleLogout =
    propLogout ||
    (async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("supabaseSession");
      localStorage.removeItem("doctorData");
      navigate("/login");
    });

  useEffect(() => {
    if (!doctor) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 text-gray-800 relative">
      {/* 🔹 Navbar */}
      <nav className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 flex justify-between items-center fixed top-0 left-0 z-20 transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:skin"
            width="28"
            height="28"
            className="text-pink-600"
          />
          <button
            onClick={() => navigate("/")}
            className="text-base sm:text-lg font-bold text-gray-800 hover:text-pink-600 transition"
          >
            Melanoma Detection
          </button>
        </div>

        {/* 🔹 Menu Desktop */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-8">
          <button
            onClick={() => navigate("/about")}
            className="text-gray-800 hover:text-pink-500 font-medium transition text-sm sm:text-base"
          >
            Tentang
          </button>
          <button
            onClick={() => navigate("/history")}
            className="text-gray-800 hover:text-pink-500 font-medium transition text-sm sm:text-base"
          >
            Riwayat
          </button>
          {doctor && (
            <>
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                {doctor.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-medium transition text-sm sm:text-base"
              >
                Keluar
              </button>
            </>
          )}
        </div>

        {/* 🔹 Hamburger Menu (Mobile) */}
        <button
          className="sm:hidden text-pink-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon
            icon={menuOpen ? "mdi:close" : "mdi:menu"}
            width="28"
            height="28"
          />
        </button>
      </nav>

      {/* 🔹 Dropdown Mobile Menu */}
      <div
        className={`sm:hidden fixed top-[56px] right-0 w-3/4 bg-white/90 backdrop-blur-md border-l border-pink-200 shadow-lg flex flex-col items-start py-4 px-6 space-y-3 z-20 rounded-l-2xl transform transition-all duration-300 ease-out ${
          menuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => {
            navigate("/about");
            setMenuOpen(false);
          }}
          className="text-gray-800 hover:text-pink-600 font-medium text-base w-full text-left transition"
        >
          Tentang
        </button>
        <button
          onClick={() => {
            navigate("/history");
            setMenuOpen(false);
          }}
          className="text-gray-800 hover:text-pink-600 font-medium text-base w-full text-left transition"
        >
          Riwayat
        </button>

        {doctor && (
          <>
            <div className="border-t border-gray-300 w-full my-2"></div>
            <span className="text-gray-700 font-semibold text-base">
              {doctor.full_name}
            </span>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white w-full px-4 py-2 rounded-md font-medium transition"
            >
              Keluar
            </button>
          </>
        )}
      </div>

      {/* 🔹 Konten Utama */}
      <div className="pt-24">
        {/* Header Section */}
        <section className="relative text-center py-16 px-6">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-pink-700 drop-shadow-lg"
          >
            Tentang Kanker Melanoma
          </motion.h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Melanoma adalah salah satu jenis kanker kulit paling berbahaya yang
            berkembang dari sel penghasil pigmen kulit (melanosit).
          </p>
        </section>

        {/* Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 py-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HeartPulse className="text-pink-600 w-8 h-8" />
              <h2 className="text-2xl font-semibold text-pink-700">
                Apa itu Melanoma?
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Melanoma merupakan kanker kulit yang muncul ketika sel melanosit
              tumbuh tidak terkendali. Walaupun jumlah kasusnya lebih sedikit
              dibanding kanker kulit lain, melanoma lebih berbahaya karena dapat
              menyebar ke organ tubuh lainnya.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sun className="text-yellow-500 w-8 h-8" />
              <h2 className="text-2xl font-semibold text-pink-700">
                Penyebab & Faktor Risiko
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Paparan sinar UV yang berlebihan, kulit putih, riwayat keluarga,
              banyak tahi lalat, dan sistem imun lemah dapat meningkatkan risiko
              terkena melanoma.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Microscope className="text-blue-600 w-8 h-8" />
              <h2 className="text-2xl font-semibold text-pink-700">
                Gejala Umum
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Perubahan ukuran, bentuk, atau warna tahi lalat, muncul bercak
              berpigmen yang tidak biasa, hingga luka yang tidak sembuh-sembuh
              adalah tanda yang perlu diwaspadai.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-green-600 w-8 h-8" />
              <h2 className="text-2xl font-semibold text-pink-700">
                Pencegahan
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Gunakan tabir surya, hindari paparan sinar matahari berlebihan,
              periksa kulit secara rutin, dan lakukan deteksi dini untuk
              mengurangi risiko melanoma.
            </p>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 px-6 bg-pink-700 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Kenali, Cegah, dan Lindungi
          </h2>
          <p className="max-w-2xl mx-auto mb-6">
            Informasi dan deteksi dini adalah kunci untuk melawan melanoma. Jaga
            kesehatan kulitmu mulai sekarang.
          </p>
          <Link
            to={"/"}
            className="px-6 py-3 bg-white text-pink-700 rounded-full font-semibold shadow-md hover:shadow-xl transition"
          >
            Prediksi sekarang
          </Link>
        </section>
      </div>
    </div>
  );
}
