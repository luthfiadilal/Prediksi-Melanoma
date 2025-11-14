import React from "react";
// Pastikan Anda sudah menginstall dan mengimport motion dari framer-motion
import { motion } from "framer-motion";

// Definisi varian untuk animasi
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Jeda antar elemen muncul
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function WhatIsMelanoma() {
  const contentText =
    "Melanoma adalalah salah satu jenis kanker kulit yang berasal dari sel melanosit (sel penghasil pigmen kulit) yang pertumbuhannya tidak normal dan tidak terkontrol sehingga berubah menjadi keganasan. Melanoma termasuk kanker kulit yang paling mematikan dan prognosisnya paling buruk. Kanker ini memiliki sifat agresif karena dapat menyebar dengan cepat (metastasis) ke organ tubuh lain jika tidak dideteksi sejak dini.";

  return (
    // Menggunakan motion.div untuk keseluruhan container jika belum di-wrap di parent
    // Jika sudah di-wrap di parent, ini berfungsi sebagai container utama untuk stagger
    <motion.div
      className="pt-10 px-6 sm:px-10 pb-10 h-full overflow-y-auto bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Judul di Tengah Atas */}
      <motion.h2
        className="text-4xl font-extrabold text-pink-600 text-center mb-10 tracking-tight"
        variants={itemVariants}
      >
        Apa Itu Melanoma?
      </motion.h2>

      {/* Konten Utama */}
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        {/* 2. Gambar di Tengah (Dipercantik dengan shadow dan border minimalis) */}
        <motion.div
          className="w-full max-w-sm h-52  mb-10 border border-gray-200  rounded-lg overflow-hidden"
          variants={itemVariants}
        >
          {/* Ganti div ini dengan tag <img> yang sebenarnya */}
          <img
            src="/image/about1.png" // Ganti dengan path yang benar
            alt="Ilustrasi Melanoma"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* 3. Teks Konten di Bawah Gambar */}
        <motion.div
          className="p-6 bg-pink-50/50 rounded-xl border border-pink-100 shadow-inner"
          variants={itemVariants}
        >
          <p className="text-gray-800 text-lg leading-relaxed text-justify">
            <strong className="font-bold text-pink-600">Melanoma</strong> adalah
            salah satu jenis{" "}
            <strong className="font-bold text-pink-600">kanker kulit</strong>{" "}
            yang berasal dari sel melanosit (sel penghasil pigmen kulit) yang
            pertumbuhannya tidak normal dan tidak terkontrol sehingga berubah
            menjadi keganasan.
            <br />
            <br />
            Melanoma termasuk kanker kulit yang paling mematikan dan
            prognosisnya paling buruk. Kanker ini memiliki sifat
            <strong className="font-bold text-pink-600"> agresif</strong> karena
            dapat menyebar dengan cepat (
            <strong className="text-pink-600 font-bold">metastasis</strong>) ke
            organ tubuh lain jika tidak dideteksi sejak dini.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
