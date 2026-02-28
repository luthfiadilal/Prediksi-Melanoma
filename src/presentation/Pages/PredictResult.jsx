import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import Swal from "sweetalert2";

export default function PredictionResult({ data, onRetake }) {
  const [note, setNote] = useState(data.notes || "");
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState(null);

  // Ambil data pasien berdasarkan patient_id di tabel examinations
  useEffect(() => {
    const fetchPatient = async () => {
      if (!data.patient_id) return;
      const { data: patientData, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", data.patient_id)
        .single();

      if (error) console.error("Gagal ambil data pasien:", error.message);
      else setPatient(patientData);
    };

    fetchPatient();
  }, [data.patient_id]);

  const saveNote = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("examinations")
        .update({ notes: note })
        .eq("id_examination", data.id_examination);

      if (error) throw error;
      Swal.fire("Berhasil", "Catatan dokter disimpan", "success");
    } catch (err) {
      Swal.fire("Gagal", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Hasil Pemeriksaan
      </h2>

      {/* Gambar hasil prediksi */}
      <img
        src={data.image_url}
        alt="Hasil pemeriksaan"
        className="w-full rounded-lg border object-contain max-h-72"
      />

      {/* Informasi Pasien */}
      {patient && (
        <div className="bg-gray-200 p-3 rounded-lg">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Data Pasien
          </h3>
          <p className="text-gray-700">
            <strong>Nama:</strong> {patient.full_name}
          </p>
          <p className="text-gray-700">
            <strong>Tanggal Lahir:</strong>{" "}
            {new Date(patient.birth_date).toLocaleDateString("id-ID")}
          </p>
          <p className="text-gray-700">
            <strong>Jenis Kelamin:</strong>{" "}
            {patient.gender === "M" ? "Laki-laki" : "Perempuan"}
          </p>
          <p className="text-gray-700">
            <strong>Keluhan:</strong> {data.complaint || "-"}
          </p>
        </div>
      )}

      {/* Hasil Prediksi */}
      <div className="space-y-1">
        <p className="text-gray-700">
          <strong>Prediksi Model:</strong>{" "}
          <span
            className={
              data.model_prediction === "Melanoma"
                ? "text-green-600 font-bold"
                : data.model_prediction === "NonSkin"
                  ? "text-gray-600 font-bold"
                  : "text-red-600 font-bold"
            }
          >
            {data.model_prediction}
          </span>
        </p>
        <p className="text-gray-700">
          <strong>Confidence:</strong> {data.confidence_score}%
        </p>
      </div>

      {/* Peringatan NonSkin */}
      {data.model_prediction === "NonSkin" && (
        <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 text-yellow-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="font-bold text-base">Foto Tidak Valid!</span>
          </div>
          <p className="text-yellow-700 text-sm text-center">
            Foto yang diunggah bukan gambar kulit yang valid. Pastikan foto menampilkan area kulit dengan jelas, lalu coba unggah ulang.
          </p>
        </div>
      )}

      {/* Catatan Dokter */}
      <div className="space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tambahkan catatan dokter..."
          className="w-full border rounded p-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          rows="4"
        />

        <button
          onClick={saveNote}
          disabled={saving}
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded w-full transition"
        >
          {saving ? "Menyimpan..." : "Simpan Catatan"}
        </button>
      </div>

      {/* Tombol Ulang Foto (hanya muncul saat NonSkin) */}
      {data.model_prediction === "NonSkin" && (
        <button
          onClick={onRetake}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Ulang Upload Foto
        </button>
      )}
    </div>
  );
}
