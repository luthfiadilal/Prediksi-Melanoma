import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { supabase } from "../../services/supabaseClient";
import { predictMelanomaUseCase } from "../../application/predictMelanoma";
import Spinner from "../Components/Spinner";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";

export default function ExaminationForm({ patient, doctor, onResult }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCamera, setIsCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = {
    facingMode: { ideal: "environment" },
    width: 640,
    height: 480,
  };

  const takePicture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      fetch(screenshot)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          setImage(file);
          setPreview(URL.createObjectURL(blob));
          setIsCamera(false);
        });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image)
      return Swal.fire("Peringatan", "Pilih atau ambil gambar dulu", "warning");

    setLoading(true);
    try {
      // 🔹 Upload ke Supabase Storage
      const fileName = `${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("image")
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("image")
        .getPublicUrl(fileName);

      // 🔹 Prediksi
      const prediction = await predictMelanomaUseCase(image);
      const entries = Object.entries(prediction.probabilities);
      const [bestLabel, bestValue] = entries.reduce((a, b) =>
        a[1] > b[1] ? a : b
      );

      const confidenceValue = parseFloat(parseFloat(bestValue).toFixed(2));

      // 🔹 Ambil ID terakhir dari tabel examinations
      const { data: lastExams, error: fetchError } = await supabase
        .from("examinations")
        .select("id_examination")
        .order("id_examination", { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      let newId = "PSN-001";
      if (lastExams && lastExams.length > 0) {
        const lastId = lastExams[0].id_examination; // contoh: "PSN-012"
        const lastNum = parseInt(lastId.split("-")[1]);
        const nextNum = (lastNum + 1).toString().padStart(3, "0");
        newId = `PSN-${nextNum}`;
      }

      // 🔹 Simpan ke tabel examinations
      const { data: inserted, error: insertError } = await supabase
        .from("examinations")
        .insert([
          {
            id_examination: newId,
            patient_id: patient.id,
            doctor_id: doctor.id,
            image_url: publicUrl.publicUrl,
            model_prediction: prediction.prediction,
            confidence_score: confidenceValue,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      onResult?.({ ...inserted, prediction });
      Swal.fire("Sukses", "Hasil prediksi berhasil disimpan", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        Pemeriksaan untuk{" "}
        <span className="text-pink-600">{patient.full_name}</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
          {isCamera ? (
            <div className="space-y-4">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-[400px] rounded-md bg-gray-800 object-cover"
              />

              <div className="flex justify-center flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={takePicture}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-pink-200 flex items-center space-x-2"
                >
                  <Icon icon="solar:camera-bold" width="20" height="20" />
                  <span>Ambil Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCamera(false)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2"
                >
                  <Icon icon="solar:close-circle-bold" width="20" height="20" />
                  <span>Batal</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Upload dari galeri */}
              <label className="cursor-pointer block mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 text-pink-700 font-medium bg-pink-100 hover:bg-pink-200 rounded px-4 py-2 transition shadow-sm">
                  <Icon icon="solar:album-outline" width="24" height="24" />
                  <span>Pilih dari Galeri</span>
                </div>
              </label>

              {/* Buka kamera */}
              <button
                type="button"
                onClick={() => setIsCamera(true)}
                className="flex w-full items-center justify-center gap-2 text-pink-700 font-medium bg-pink-100 hover:bg-pink-200 rounded px-4 py-2 transition shadow-sm"
              >
                <Icon icon="solar:camera-bold" width="22" height="22" />
                <span>Buka Kamera</span>
              </button>
            </>
          )}

          {/* Preview hasil foto */}
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-48 rounded-md border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !image}
          className="w-full bg-pink-500 hover:bg-pink-700 text-white font-semibold py-3 rounded transition disabled:opacity-50"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            "Deteksi Sekarang"
          )}
        </button>
      </form>
    </div>
  );
}
