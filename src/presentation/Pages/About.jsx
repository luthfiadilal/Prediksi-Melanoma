import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  BookOpen,
  Sun,
  Microscope,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { supabase } from "../../services/supabaseClient";

// 1. Import komponen konten
import WhatIsMelanoma from "../Components/WhatIsMelanoma";
import VulnerableIndividuals from "../Components/VulnerableIndividuals";
import AbcdeCriteria from "../Components/AbcdeCriteria";
import UrgentSigns from "../Components/UrgentSigns";
import FirstAid from "../Components/FirstAid";
import SelfMonitoringEducation from "../Components/SelfMonitoringEducation";
import GPRole from "../Components/GPRole";

// 2. Definisikan list menu dan komponen yang sesuai
const menuItems = [
  { id: "whatIs", label: "Apa itu Melanoma?", component: WhatIsMelanoma },
  {
    id: "vulnerable",
    label: "Individu Rentan Melanoma",
    component: VulnerableIndividuals,
  },
  { id: "abcde", label: "Kriteria ABCDE", component: AbcdeCriteria },
  { id: "urgentSign", label: "Tanda Urgent Melanoma", component: UrgentSigns },
  {
    id: "firstAid",
    label: "Penanganan Pertama Pada Pasien Melanoma",
    component: FirstAid,
  },
  {
    id: "selfMonitor",
    label: "Cara Edukasi untuk Pemantauan Mandiri",
    component: SelfMonitoringEducation,
  },
  { id: "gpRole", label: "Peran Dokter Umum", component: GPRole },
];

export default function About({
  doctor: propDoctor,
  handleLogout: propLogout,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contentMenuOpen, setContentMenuOpen] = useState(false);
  const [doctor, setDoctor] = useState(
    propDoctor || JSON.parse(localStorage.getItem("doctorData"))
  );
  const [activeMenu, setActiveMenu] = useState(menuItems[0].id);

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

  const ActiveContentComponent = useMemo(() => {
    const item = menuItems.find((item) => item.id === activeMenu);
    return item ? item.component : null;
  }, [activeMenu]);

  const activeMenuLabel = useMemo(() => {
    return (
      menuItems.find((item) => item.id === activeMenu)?.label || "Pilih Materi"
    );
  }, [activeMenu]);

  const handleContentMenuClick = (id) => {
    setActiveMenu(id);
    setContentMenuOpen(false);
  };

  return (
    // Hapus pt-[56px] sm:pt-[60px] di sini karena kita akan menggunakan padding di dalam flex container
    <div className="min-h-screen text-gray-800 relative bg-gray-50">
      {/* 🔹 Navbar (FIXED) */}
      <nav className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 flex justify-between items-center fixed top-0 left-0 z-20 transition-all duration-300">
        {/* ... (Navbar konten tetap sama) ... */}
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
            Deteksi Melanoma
          </button>
        </div>

        {/* Menu Desktop & Mobile Button (Tetap sama) */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-8">
          {/* ... (Menu Desktop) ... */}
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
        <button
          className="sm:hidden text-pink-700 focus:outline-none"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setContentMenuOpen(false);
          }}
        >
          <Icon
            icon={menuOpen ? "mdi:close" : "mdi:menu"}
            width="28"
            height="28"
          />
        </button>
      </nav>

      {/* 🔹 Dropdown Mobile Menu UTAMA & Dropdown Mobile Konten (TETAP SAMA) */}
      {/* ... (Dropdown Mobile Menu Utama) ... */}
      <div
        className={`sm:hidden fixed top-[56px] right-0 w-3/4 bg-white/90 backdrop-blur-md border-l border-pink-200 shadow-lg flex flex-col items-start py-4 px-6 space-y-3 z-30 rounded-l-2xl transform transition-all duration-300 ease-out ${
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

      {/* 🌟 Dropdown Menu Konten Mobile 🌟 */}
      <div className="lg:hidden w-full px-4 py-3 bg-white border-b border-gray-200 z-10 sticky top-[56px] shadow-sm">
        <button
          onClick={() => {
            setContentMenuOpen(!contentMenuOpen);
            setMenuOpen(false);
          }}
          className="w-full flex justify-between items-center px-4 py-2 bg-pink-50 border border-pink-300 text-pink-700 font-semibold rounded-lg shadow-sm"
        >
          {activeMenuLabel}
          {contentMenuOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {contentMenuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-white border border-pink-200 shadow-xl rounded-b-lg mt-1 z-40 overflow-hidden"
          >
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.component) {
                      handleContentMenuClick(item.id);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition duration-200 ${
                    activeMenu === item.id
                      ? "bg-pink-100 text-pink-800 border-l-4 border-pink-600"
                      : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                  } ${!item.component ? "cursor-not-allowed opacity-60" : ""}`}
                  disabled={!item.component}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* 🔹 Konten Utama & Menu Samping DESKTOP */}

      {/* Container Utama untuk Desktop: Menambahkan padding atas untuk mengatasi Navbar FIXED */}
      <div className="flex relative pt-[56px] sm:pt-[60px]">
        {/* List disamping (DESKTOP FIXED) */}
        <div
          // KUNCI PERUBAHAN: Menghitung tinggi agar list menu mengisi sisa layar
          className="flex-shrink-0 w-[280px] bg-white border-r border-gray-200 shadow-md hidden lg:block"
        >
          {/* KUNCI PERUBAHAN: Menjadikan div ini STICKY dan mengisi sisa tinggi layar */}
          <div className="sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.component) {
                        setActiveMenu(item.id);
                      }
                    }}
                    className={`w-full text-left px-6 py-4 font-medium transition duration-200
                                    ${
                                      activeMenu === item.id
                                        ? "bg-gray-100 text-pink-600 border-l-4 border-pink-600"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                                    }
                                    ${
                                      !item.component
                                        ? "cursor-not-allowed opacity-60"
                                        : ""
                                    }
                                `}
                    disabled={!item.component}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content yang dinamis (SCROLLABLE) */}
        <div className="flex-grow w-full bg-white">
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            {/* Render Komponen yang Aktif */}
            {ActiveContentComponent ? (
              <ActiveContentComponent />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Microscope className="w-12 h-12 mx-auto mb-4 text-pink-500" />
                <p className="text-xl font-semibold">Konten Segera Hadir</p>
                <p>
                  Informasi untuk "
                  {menuItems.find((item) => item.id === activeMenu)?.label}"
                  sedang kami siapkan.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
