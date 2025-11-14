import React from "react";
import { motion } from "framer-motion";
import { BookOpen, AlertTriangle, Lightbulb, Clock, Eye } from "lucide-react";

// Data untuk Edukasi Pemantauan Mandiri
const educationData = [
  {
    title: "Mengajarkan Tentang Kriteria ABCDE",
    description:
      "Edukasi harus mencakup arti setiap huruf (Asymmetry, Border, Color, Diameter, Evolving), yang merupakan panduan untuk mengidentifikasi tahi lalat atau bintik yang mencurigakan.",
    icon: BookOpen,
  },
  {
    title: "Memperkenalkan 'Ugly Duckling Sign'",
    description:
      "Pasien dengan banyak tahi lalat harus diajarkan untuk mencari lesi yang paling berbeda atau tidak cocok dari semua tahi lalat lain di tubuh mereka. Melanoma sering muncul sebagai satu tahi lalat yang aneh di antara tahi lalat jinak yang seragam.",
    icon: Lightbulb,
  },
  {
    title: "Waspadai Tanda Urgent",
    description:
      "Pasien harus diinstruksikan untuk segera mencari bantuan medis jika tahi lalat menunjukkan tanda-tanda perkembangan agresif seperti luka terbuka dalam (borok) dan perubahan sensasi seperti gatal, rasa terbakar, atau perih.",
    icon: AlertTriangle,
  },
  {
    title: "Edukasi Untuk Tidak Menunda Pemeriksaan",
    description:
      "Melanoma bisa menyerupai tahi lalat biasa, dan tahi lalat yang kecil pun berpotensi menjalar ke mana-mana. Edukasi pasien untuk tidak menunda pemeriksaan jika mereka menemukan kejanggalan.",
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

export default function SelfMonitoringEducation() {
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
        Cara Edukasi untuk Pemantauan Mandiri
      </motion.h2>

      {/* Caption/Pengantar */}
      <motion.p
        className={`max-w-3xl mx-auto text-center text-gray-700 mb-12 text-lg leading-relaxed border-b border-gray-200 pb-4`}
        variants={itemVariants}
      >
        Edukasi kepada pasien tentang pemantauan mandiri secara teratur adalah{" "}
        <strong className={`font-bold ${primaryColor}`}>
          kunci deteksi dini
        </strong>{" "}
        yang efektif.
      </motion.p>

      {/* 2. List Poin Edukasi */}
      <div className="max-w-4xl mx-auto space-y-8">
        {educationData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              // Card Styling: Lebih fokus pada border dan shadow ringan
              className={`flex items-start ${lightBgColor} p-5 rounded-xl border border-pink-200 shadow-md transition-shadow duration-300 hover:shadow-lg`}
              variants={itemVariants}
            >
              {/* Icon dan Nomor Poin */}
              <div className="flex-shrink-0 mr-4 text-center">
                <IconComponent className={`w-8 h-8 ${primaryColor} mb-1`} />
                <span className={`text-sm font-bold ${primaryColor}`}>
                  {index + 1}
                </span>
              </div>

              {/* Teks Konten */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
