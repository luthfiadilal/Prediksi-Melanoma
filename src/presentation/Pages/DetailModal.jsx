import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export default function DetailModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tombol Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <Icon icon="mdi:close" width="24" height="24" />
          </button>

          {/* Judul */}
          <h2 className="text-xl font-semibold text-center mb-4">
            Riwayat Pemeriksaan
          </h2>

          {/* Gambar Prediksi */}
          {data.image_url && (
            <div className="flex justify-center mb-5">
              <img
                src={data.image_url}
                alt="Hasil Prediksi"
                className="rounded-lg shadow-sm max-h-[180px] object-contain border border-gray-200"
              />
            </div>
          )}

          {/* Informasi Header */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-xs text-gray-500 mb-1">Nomor Pasien</p>
              <p className="text-2xl font-bold text-gray-800">
                {data.id_examination || "0000"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {new Date(data.examination_date).toLocaleDateString("id-ID")}
              </p>
              <p className="text-gray-800 font-medium text-sm">
                Dokter : {data.doctors?.full_name || "-"}
              </p>
            </div>
          </div>

          {/* Informasi Detail Dua Kolom */}
          <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700 mb-4">
            <div>
              <span className="font-semibold block mb-0.5">Nama</span>
              <p>{data.patients?.full_name || "-"}</p>
            </div>
            <div>
              <span className="font-semibold block mb-0.5">Keluhan</span>
              <p>{data.patients?.complaint || "-"}</p>
            </div>

            <div>
              <span className="font-semibold block mb-0.5">Tanggal Lahir</span>
              <p>
                {data.patients?.birth_place
                  ? `${data.patients.birth_place}, ${data.patients.birth_date}`
                  : data.patients?.birth_date || "-"}
              </p>
            </div>
            <div>
              <span className="font-semibold block mb-0.5">Hasil Prediksi</span>
              <p className="font-bold">{data.model_prediction || "-"}</p>
            </div>

            <div>
              <span className="font-semibold block mb-0.5">Jenis Kelamin</span>
              <p>{data.patients?.gender || "-"}</p>
            </div>
            <div>
              <span className="font-semibold block mb-0.5">Confidence</span>
              <p>{data.confidence_score ? `${data.confidence_score}%` : "-"}</p>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <p className="font-semibold text-gray-800 mb-1 text-sm">Catatan</p>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 border border-gray-200">
              {data.notes || "-"}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
