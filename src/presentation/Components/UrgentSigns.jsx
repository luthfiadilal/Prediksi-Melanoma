import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, XCircle, HeartPulse, Slash } from "lucide-react"; // Menambahkan Slash untuk pemisah visual

// Data untuk Tanda Urgent Melanoma (TETAP SAMA)
const urgentData = [
  {
    title: "Borok atau Luka Terbuka Dalam pada Lesi",
    description:
      "Timbulnya borok (ulserasi) pada tahi lalat atau lesi kulit berarti melanoma tersebut telah tumbuh cukup dalam hingga merusak lapisan permukaan kulit. Borok sering diartikan sebagai tanda bahwa sel kanker tumbuh sangat cepat dan tidak terkontrol, sehingga jaringan kulit di atasnya 'hancur' atau mati.",
    icon: XCircle,
  },
  {
    title: "Gatal yang Konstan dan Rasa Terbakar/Perih pada Lesi",
    description:
      "Tahi lalat jinak jarang terasa gatal secara konstan. Gatal yang menetap, atau sensasi terbakar/perih yang baru muncul, seringkali merupakan tanda aktivitas sel kanker di lapisan kulit yang lebih dalam.",
    icon: AlertTriangle,
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

export default function UrgentSigns() {
  // Definisikan warna yang akan digunakan untuk penekanan "Urgent"
  const urgentColor = "text-pink-600";
  const lightBgColor = "bg-pink-50";
  const borderColor = "border-pink-500";
  const hoverBgColor = "hover:bg-pink-100"; // Diubah sedikit lebih gelap untuk hover

  return (
    <motion.div
      className="pt-10 px-6 sm:px-10 pb-10 h-full overflow-y-auto bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Judul di Tengah Atas */}
      <motion.h2
        className={`text-4xl font-extrabold ${urgentColor} text-center mb-6 tracking-tight`}
        variants={itemVariants}
      >
        Tanda Urgent Melanoma
      </motion.h2>

      {/* Caption/Pengantar */}
      <motion.p
        className={`max-w-3xl mx-auto text-center text-gray-700 mb-10 text-lg leading-relaxed border-b border-gray-200 pb-4`}
        variants={itemVariants}
      >
        <strong className={`${urgentColor} font-bold`}>
          Gejala klinis yang Urgent
        </strong>{" "}
        pada tahi lalat atau bintik kulit ini sangat penting dan mengindikasikan
        perlunya <strong className="font-bold">rujukan segera</strong> kepada
        dokter spesialis.
      </motion.p>

      <div className="max-w-4xl mx-auto">
        {/* 2. Gambar Utama (Kotak dan Terpusat) */}
        <div className="flex justify-center gap-6 mb-12">
          {["urgent1.png", "urgent2.png"].map((imageName, index) => (
            <motion.div
              key={imageName}
              className={`w-40 max-w-full aspect-square ${lightBgColor} border-2 ${borderColor} rounded-lg overflow-hidden shadow-xl flex-none`}
              initial={{ opacity: 0, rotateX: 90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
            >
              <img
                src={`/image/${imageName}`} // Ganti path sesuai struktur Anda
                alt={`Ilustrasi Tanda Urgent ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* 3. List Deskripsi (Dipercantik) */}
        <div className="space-y-6">
          {urgentData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                // Gaya Card Baru: Latar belakang pink lembut, shadow lebih halus, dan rounded penuh
                className={`${lightBgColor} p-6 rounded-2xl shadow-lg transition-all duration-300 ${hoverBgColor} border border-pink-200`}
                variants={itemVariants}
              >
                {/* Judul dan Ikon */}
                <div className="flex items-start space-x-3 mb-3 border-b border-pink-300/50 pb-2">
                  <span className="flex-shrink-0 pt-1">
                    <IconComponent className={`w-6 h-6 ${urgentColor}`} />
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {index + 1}. {item.title}
                  </h3>
                </div>

                {/* Deskripsi */}
                <p className="text-gray-800 leading-relaxed pt-2">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
