import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientRegistration from "./PatientForm";
import ExaminationForm from "./Examination";
import PredictionResult from "./PredictResult";
import { supabase } from "../../services/supabaseClient";
import { Icon } from "@iconify/react";

export default function Homes() {
  const [patient, setPatient] = useState(null);
  const [result, setResult] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // <--- untuk hamburger
  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctorData");
    const session = localStorage.getItem("supabaseSession");

    if (!storedDoctor || !session) {
      navigate("/login");
      return;
    }

    setDoctor(JSON.parse(storedDoctor));
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("supabaseSession");
    localStorage.removeItem("doctorData");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: "url('/image/akurasi image.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* 🔹 Navbar */}
      <nav className="w-full backdrop-blur-md bg-white/30 border-b border-white/40 shadow-sm py-3 px-4 sm:px-6 flex justify-between items-center fixed top-0 left-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:skin"
            width="28"
            height="28"
            className="text-pink-600"
          />
          <h1 className="text-base sm:text-lg font-bold text-white drop-shadow">
            Melanoma Detection
          </h1>
        </div>

        {/* 🔹 Menu Desktop */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-8">
          <button
            onClick={() => navigate("/about")}
            className="text-white hover:text-pink-200 font-medium transition text-sm sm:text-base"
          >
            Tentang
          </button>
          <button
            onClick={() => navigate("/history")}
            className="text-white hover:text-pink-200 font-medium transition text-sm sm:text-base"
          >
            Riwayat
          </button>
          {doctor && (
            <>
              <span className="text-white font-medium drop-shadow text-sm sm:text-base">
                {doctor.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-pink-500 hover:bg-pink-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-medium transition text-sm sm:text-base"
              >
                Keluar
              </button>
            </>
          )}
        </div>

        {/* 🔹 Hamburger Menu Button (Mobile) */}
        <button
          className="sm:hidden text-white focus:outline-none"
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
        className={`sm:hidden fixed top-[56px] right-0 w-3/4 bg-white/90 backdrop-blur-md border-l border-white/30 shadow-lg flex flex-col items-start py-4 px-6 space-y-3 z-20 rounded-l-2xl transform transition-all duration-300 ease-out ${menuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
          }`}
      >
        <button
          onClick={() => {
            navigate("/about");
            setMenuOpen(false);
          }}
          className="text-gray-800 hover:text-pink-500 font-medium text-base w-full text-left transition-colors duration-200 ease-out"
        >
          Tentang
        </button>
        <button
          onClick={() => {
            navigate("/history");
            setMenuOpen(false);
          }}
          className="text-gray-800 hover:text-pink-500 font-medium text-base w-full text-left transition-colors duration-200 ease-out"
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
              className="bg-pink-500 hover:bg-pink-700 text-white w-full px-4 py-2 rounded-md font-medium transition-colors duration-200 ease-out mt-2"
            >
              Keluar
            </button>
          </>
        )}
      </div>

      {/* 🔹 Main Content */}
      <main className="flex flex-col md:flex-row items-center justify-center flex-grow p-4 sm:p-6 md:px-[100px] pt-[80px] sm:pt-[100px] relative z-10">
        {/* Kiri */}
        <div className="flex-1 text-center md:text-left mb-8 md:mb-0 text-white drop-shadow-lg px-2 sm:px-0">
          <h1 className="text-[28px] sm:text-[34px] md:text-[42px] font-extrabold leading-tight">
            Sistem <span className="text-pink-400">Deteksi Melanoma</span>
          </h1>
          <p className="text-sm sm:text-base md:text-[20px] mt-3 max-w-md text-gray-100 mx-auto md:mx-0">
            Aplikasi ini membantu dokter dalam mencatat data pasien, melakukan
            pemeriksaan, serta memprediksi potensi melanoma kulit dengan cepat
            dan akurat.
          </p>
        </div>

        {/* Kanan */}
        <div className="flex-1 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6 border border-white/50 mx-2 sm:mx-0">
          {!doctor ? (
            <p className="text-center text-gray-600">Memuat data dokter...</p>
          ) : (
            <>
              {!patient && !result && (
                <PatientRegistration onRegistered={(p) => setPatient(p)} />
              )}
              {patient && !result && (
                <ExaminationForm
                  patient={patient}
                  doctor={doctor}
                  onResult={(r) => setResult(r)}
                />
              )}
              {result && (
                <PredictionResult
                  data={result}
                  onRetake={() => setResult(null)}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
