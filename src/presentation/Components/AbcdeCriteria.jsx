import React from "react";
import { motion } from "framer-motion";
import {
  ListChecks,
  Scaling,
  Ruler,
  Droplet,
  Clock,
  Asterisk,
} from "lucide-react";

// Data untuk Kriteria ABCDE (TETAP SAMA)
const criteriaData = [
  {
    letter: "A",
    name: "Asymmetry (Asimetri)",
    description:
      "Tidak simetris, satu sisi tahi lalat tidak cocok dengan sisi lainnya. Tahi lalat jinak umumnya simetris (bulat).",
    images: ["kriteria1.png", "kriteria2.png"],
    icon: Scaling,
  },
  {
    letter: "B",
    name: "Border (Batas)",
    description: "Tepi lesi tidak rata, bergerigi, kabur, atau tidak jelas.",
    images: ["kriteria3.png", "kriteria4.png"],
    icon: ListChecks,
  },
  {
    letter: "C",
    name: "Color (Warna)",
    description:
      "Memiliki beragam warna dalam satu lesi (seperti hitam, cokelat, tan, merah, putih, atau biru).",
    images: ["kriteria5.png", "kriteria6.png"],
    icon: Droplet,
  },
  {
    letter: "D",
    name: "Diameter (Diameter)",
    description:
      "Ukurannya lebih besar dari 6 mm (sekitar seukuran penghapus pensil).",
    images: ["kriteria7.png", "kriteria8.png"],
    icon: Ruler,
  },
  {
    letter: "E",
    name: "Evolving (Perubahan)",
    description:
      "Tahi lalat berubah dari waktu ke waktu (dalam ukuran, bentuk, warna) atau mulai menunjukkan gejala baru seperti gatal, berdarah, atau borok.",
    images: ["kriteria9.png", "kriteria10.png"],
    icon: Clock,
  },
];

// Varian Framer Motion (TETAP SAMA)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

export default function AbcdeCriteria() {
  return (
    <motion.div
      className="pt-10 px-6 sm:px-10 pb-10 h-full overflow-y-auto bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Judul di Tengah Atas */}
      <motion.h2
        className="text-4xl font-extrabold text-pink-600 text-center mb-6 tracking-tight"
        variants={itemVariants}
      >
        Kriteria ABCDE Melanoma
      </motion.h2>

      {/* Caption/Pengantar */}
      <motion.p
        className="max-w-3xl mx-auto text-center text-gray-600 mb-10 text-lg leading-relaxed"
        variants={itemVariants}
      >
        <strong className="text-pink-600 font-bold">Kriteria ABCDE</strong>{" "}
        adalah sebuah panduan vital untuk mendeteksi tanda-tanda awal melanoma.
        Ini adalah alat penting yang harus diketahui oleh tenaga kesehatan dan
        pasien yang memiliki risiko tinggi.
      </motion.p>

      {/* 2. List Kriteria dengan Tata Letak Baru & Gambar Kotak */}
      <div className="max-w-4xl mx-auto space-y-12">
        {criteriaData.map((item, index) => {
          return (
            <motion.div
              key={item.letter}
              className="p-6 rounded-2xl border border-gray-200 shadow-xl bg-white transition-all duration-300 hover:shadow-2xl hover:border-pink-300"
              variants={itemVariants}
            >
              {/* BARIS 1: Gambar 1 | Gambar 2 (Kotak dan Terpusat) */}
              <div className="flex justify-center gap-6 mb-4">
                {item.images.map((imageName, imgIndex) => (
                  <motion.div
                    key={imgIndex}
                    // Kunci Perubahan: Menggunakan fixed width (w-36) dan aspect-square untuk kotak
                    // max-w-full agar tetap responsif
                    className="w-36 max-w-full aspect-square bg-gray-100 border-2 border-pink-400 rounded-lg overflow-hidden shadow-md flex-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.1 + 0.3 + imgIndex * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    {/* Menggunakan object-contain agar gambar tidak terpotong (crop) */}
                    <img
                      src={`/image/${imageName}`} // Pastikan path benar
                      alt={`${item.name} - Ilustrasi ${imgIndex + 1}`}
                      className="w-full h-full object-contain p-1" // p-1 untuk sedikit padding di dalam kotak
                    />
                  </motion.div>
                ))}
              </div>

              {/* BARIS 2: Huruf dan Nama Kriteria */}
              <div className="flex items-center space-x-3 mb-3 border-b-2 border-pink-200 pb-2">
                <motion.span
                  className="text-5xl font-black text-pink-700 w-12 text-center drop-shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: index * 0.1 + 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {item.letter}
                </motion.span>
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.name}
                </h3>
              </div>

              {/* BARIS 3: Deskripsi */}
              <motion.p
                className="text-gray-700 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
              >
                <Asterisk className="inline w-4 h-4 text-pink-500 mr-2 -mt-1" />
                {item.description}
              </motion.p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
