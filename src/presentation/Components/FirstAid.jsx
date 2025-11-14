import React from "react";
import { motion } from "framer-motion";
import { Sun, UserCheck, Stethoscope } from "lucide-react";

// Data Penanganan Pertama
const firstAidData = [
  {
    title: "Proteksi Ketat dari Sinar Matahari (UV)",
    description:
      "Dokter umum harus menyarankan kepada pasien agar area melanoma (atau lesi yang dicurigai) dilindungi secara ketat dari paparan sinar matahari langsung dan menggunakan sunscreen. Tindakan pencegahan ini krusial karena radiasi UV dapat memicu kerusakan genetik tambahan pada sel kanker.",
    detail:
      "Kerusakan genetik tambahan berisiko mempercepat perkembangan lokal (melebar/meluas) atau metastasis ke organ lain seperti kelenjar getah bening atau paru-paru.",
    icon: Sun,
  },
  {
    title: "Prioritas Rujukan ke Dokter Spesialis",
    description:
      "Selain proteksi ketat, tidak ada lagi intervensi awal yang dapat dilakukan oleh dokter umum.",
    detail:
      "Penanganan berikutnya harus diserahkan kepada dokter spesialis yang akan menentukan staging kanker dan rencana pengobatan lanjutan.",
    icon: Stethoscope,
  },
];

// Varian Framer Motion (Tetap Sama)
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

export default function FirstAid() {
  const primaryColor = "text-pink-600";
  const lightBgColor = "bg-pink-50";

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
        Penanganan Pertama Pada Pasien Melanoma
      </motion.h2>

      {/* Caption/Pengantar */}
      <motion.p
        className={`max-w-3xl mx-auto text-center text-gray-700 mb-12 text-lg leading-relaxed border-b border-gray-200 pb-4`}
        variants={itemVariants}
      >
        Sebagai dokter umum, fokus utama dalam penanganan pasien dengan dugaan
        melanoma adalah{" "}
        <strong className={`font-bold ${primaryColor}`}>proteksi segera</strong>{" "}
        dan <strong className="font-bold">rujukan cepat</strong> ke dokter
        spesialis.
      </motion.p>

      {/* 2. List Deskripsi (Estetik dan Rapi) */}
      <div className="max-w-4xl mx-auto space-y-10">
        {firstAidData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              className={`flex flex-col lg:flex-row ${lightBgColor} p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl border border-pink-200`}
              variants={itemVariants}
            >
              {/* Ikon dan Judul Utama */}
              <div className="lg:w-1/3 flex items-start space-x-3 mb-4 lg:mb-0 lg:pr-6 lg:border-r border-pink-200">
                <IconComponent
                  className={`w-8 h-8 ${primaryColor} flex-shrink-0`}
                />
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {item.title}
                </h3>
              </div>

              {/* Deskripsi */}
              <div className="lg:w-2/3 lg:pl-6">
                <p className="text-gray-800 leading-relaxed mb-3">
                  <strong className={`${primaryColor}`}>Inti Tindakan:</strong>{" "}
                  {item.description}
                </p>
                <p className="text-sm text-gray-600 border-t border-pink-200 pt-2 italic">
                  <strong className="text-pink-700">Penting:</strong>{" "}
                  {item.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
