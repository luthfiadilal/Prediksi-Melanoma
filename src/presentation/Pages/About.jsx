import { motion } from "framer-motion";
import { HeartPulse, BookOpen, Sun, Microscope } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 text-gray-800">
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
            <h2 className="text-2xl font-semibold text-pink-700">Pencegahan</h2>
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
        <h2 className="text-3xl font-bold mb-4">Kenali, Cegah, dan Lindungi</h2>
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
  );
}
