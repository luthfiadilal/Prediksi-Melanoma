import React from "react";
import { motion } from "framer-motion";
import { UserCheck, Hospital, Shield } from "lucide-react";

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

export default function GPRole() {
  const primaryColor = "text-pink-600";

  return (
    <motion.div
      className="pt-10 px-6 sm:px-10 pb-10 h-full overflow-y-auto bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Judul di Tengah Atas */}
      <motion.h2
        className={`text-4xl font-extrabold ${primaryColor} text-center mb-6 tracking-tight`}
        variants={itemVariants}
      >
        Peran Dokter Umum
      </motion.h2>

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* 2. Gambar /image/logo.png (Tanpa Card Pembungkus) */}
        <motion.div
          className="w-50 h-50 mb-10 overflow-hidden" // Ukuran kotak agar logo terlihat proporsional
          variants={itemVariants}
        >
          <img
            src="/image/logo.png" // Ganti path sesuai struktur Anda
            alt="Logo/Ilustrasi Peran Dokter Umum"
            className="w-full h-full object-cover" // object-contain agar logo tidak terpotong
          />
        </motion.div>

        {/* 3. Deskripsi Utama */}
        <motion.p
          className={`text-gray-800 mb-8 text-xl leading-relaxed text-justify px-4 lg:px-0`}
          variants={itemVariants}
        >
          Sebagai kanker kulit yang paling mematikan dan prognosisnya paling
          buruk, peran **dokter umum** sebagai **garda terdepan** dalam deteksi
          dini melanoma sangatlah penting karena dokter umum adalah kontak medis
          pertama pasien.
        </motion.p>

        {/* 4. Poin-poin Krusial Dokter Umum */}
        <motion.div
          className="w-full space-y-4 p-6 bg-pink-50 rounded-xl border-l-4 border-pink-500 shadow-md"
          variants={itemVariants}
        >
          <div className="flex items-start space-x-3">
            <Shield className={`w-5 h-5 mt-1 flex-shrink-0 ${primaryColor}`} />
            <p className="text-gray-700 leading-relaxed">
              Melanoma bisa menyerupai tahi lalat biasa; sekecil apapun tetap
              berbahaya dan dapat menjalar ke mana-mana. Peran dokter umum
              adalah **mengedukasi pasien** dalam melakukan pemantauan mandiri.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <UserCheck
              className={`w-5 h-5 mt-1 flex-shrink-0 ${primaryColor}`}
            />
            <p className="text-gray-700 leading-relaxed">
              Jika kecurigaan muncul, peran krusial dokter umum adalah
              memastikan **rujukan segera** ke dokter spesialis kulit yang
              memiliki fasilitas dermoskopi atau rumah sakit pusat kanker.
            </p>
          </div>
        </motion.div>

        {/* 5. Informasi Penutup (Sumber/Kontak) */}
        <motion.div
          className="mt-12 text-center border-t border-gray-200 pt-6 max-w-sm"
          variants={itemVariants}
        >
          <p className="text-sm font-semibold text-gray-700">Dikutip dari:</p>
          <h4 className={`text-lg font-bold ${primaryColor} mt-1`}>
            dr. Dia Febrina, Sp.DVE, FINSDV.
          </h4>
          <p className="text-sm text-gray-500">
            Dokter Spesialis Dermatologi, Venerologi, dan Estetika.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
