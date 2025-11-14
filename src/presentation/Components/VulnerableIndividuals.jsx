import React from "react";
import { motion } from "framer-motion";
import { User, Sun, Users, Stethoscope } from "lucide-react";

// Data untuk list Individu Rentan Melanoma
const vulnerabilityData = [
  {
    icon: User,
    title: "Individu Berkulit Putih",
    description:
      "Individu berkulit putih lebih rentan terhadap melanoma karena mereka memiliki kadar melanin yang lebih rendah dibandingkan individu berkulit gelap. Melanin berfungsi sebagai pelindung alami terhadap efek buruk radiasi ultraviolet (UV) matahari. Oleh karena itu, kurangnya melanin menyebabkan proteksi kulit terhadap kerusakan UV menjadi minimal, sehingga meningkatkan risiko terkena melanoma.",
  },
  {
    icon: Sun,
    title: "Individu yang Sering Terpapar Sinar Matahari",
    description:
      "Paparan berlebihan terhadap radiasi ultraviolet (UV) dari sinar matahari adalah pemicu utama melanoma, karena sinar UV secara langsung merusak DNA dalam sel pigmen kulit (melanosit).",
  },
  {
    icon: Users,
    title: "Ada Riwayat Kanker dalam Keluarga",
    description:
      "Memiliki riwayat keluarga, terutama kerabat tingkat pertama (orang tua atau saudara kandung), yang didiagnosis menderita melanoma secara signifikan meningkatkan risiko seseorang karena adanya kemungkinan warisan mutasi genetik.",
  },
  {
    icon: Stethoscope,
    title: "Individu dengan Banyak Tahi Lalat (Ugly Duckling Sign)",
    description:
      'Bagi individu dengan banyak tahi lalat, risiko melanoma meningkat, dan tantangannya adalah mencari "Ugly Duckling Sign." Konsep ini berarti melanoma seringkali adalah tahi lalat yang sangat menyimpang atau berbeda dari pola tahi lalat jinak lainnya di tubuh.',
  },
];

// Varian Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export default function VulnerableIndividuals() {
  return (
    <motion.div
      className="pt-10 px-6 sm:px-10 pb-10 h-full overflow-y-auto bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Judul di Tengah Atas */}
      <motion.h2
        className="text-4xl font-extrabold text-pink-600 text-center mb-10 tracking-tight"
        variants={itemVariants}
      >
        Individu Rentan Melanoma
      </motion.h2>

      {/* Konten List */}
      <div className="max-w-4xl mx-auto space-y-8">
        {vulnerabilityData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              className="flex items-start bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
            >
              {/* Icon di kiri */}
              <div className="flex-shrink-0 mr-4 mt-1">
                <IconComponent className="w-8 h-8 text-pink-500" />
              </div>

              {/* Teks Konten */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
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
