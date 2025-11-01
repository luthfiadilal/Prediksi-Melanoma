import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { predictMelanomaUseCase } from "../../application/predictMelanoma";
import Modal from "../Components/Modal";
import Spinner from "../Components/Spinner";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient"; // pastikan file ini ada

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // 🔒 Cek session
  useEffect(() => {
    const session = localStorage.getItem("supabaseSession");
    if (!session) {
      navigate("/login");
    }
  }, [navigate]);

  // 📷 Kamera config
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
          setResult(null);
          setShowCamera(false);
        });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    setResult(null);

    try {
      const prediction = await predictMelanomaUseCase(image);
      setResult(prediction);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat prediksi.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Fungsi Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("supabaseSession");
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
      alert("Gagal logout. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-gray-100">
      {/* ✅ Navbar */}
      <nav className="w-full bg-white shadow-sm py-3 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:skin"
            width="28"
            height="28"
            className="text-pink-600"
          />
          <h1 className="text-lg font-bold text-gray-800">
            Melanoma Detection
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/about"
            className="text-gray-700 hover:text-pink-600 font-medium transition"
          >
            Tentang
          </Link>
          <button
            onClick={handleLogout}
            className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-grow p-6 md:px-[100px]">
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
          <h1 className="md:text-[48px] text-[32px] font-extrabold mt-6 leading-tight text-gray-800">
            Deteksi <span className="text-pink-500">Melanoma</span> Kulit
          </h1>
          <p className="text-gray-600 md:text-[22px] mt-3 max-w-md">
            Unggah gambar kulit Anda atau gunakan kamera untuk mendeteksi
            potensi melanoma secara instan.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
              {/* Kamera */}
              {showCamera ? (
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
                      onClick={() => setShowCamera(false)}
                      className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2"
                    >
                      <Icon
                        icon="solar:close-circle-bold"
                        width="20"
                        height="20"
                      />
                      <span>Batal</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Upload */}
                  <label className="cursor-pointer block mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <div className="flex items-center justify-center gap-2 text-pink-700 font-medium bg-pink-100 hover:bg-pink-200 rounded px-4 py-2 transition shadow-sm">
                      <Icon icon="solar:album-outline" width="24" height="24" />
                      <span>Pilih dari Galeri</span>
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="flex w-full items-center justify-center gap-2 text-pink-700 font-medium bg-pink-100 hover:bg-pink-200 rounded px-4 py-2 transition shadow-sm"
                  >
                    <Icon icon="solar:camera-bold" width="22" height="22" />
                    <span>Buka Kamera</span>
                  </button>
                </>
              )}

              {/* Preview */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !image}
              className={`w-full bg-pink-500 hover:bg-pink-700 text-white font-semibold py-3 rounded transition disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Spinner className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                "Deteksi Sekarang"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Hasil Prediksi Melanoma"
      >
        {result ? (
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {preview && (
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={preview}
                  alt="Gambar yang diproses"
                  className="max-h-60 w-auto md:max-h-[400px] rounded-lg shadow-md border object-contain"
                />
              </div>
            )}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow mx-auto md:mx-0">
                <Icon icon="mdi:dna" width="40" height="40" />
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Hasil Prediksi:
              </h3>
              <p
                className={`text-2xl font-bold ${
                  result.prediction === "Melanoma"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {result.prediction}
              </p>

              <h4 className="text-base md:text-lg font-semibold text-gray-800 mt-2">
                Probabilitas:
              </h4>
              <ul className="space-y-1">
                {Object.entries(result.probabilities).map(([key, value]) => (
                  <li
                    key={key}
                    className="text-gray-700 text-sm md:text-base font-medium"
                  >
                    {key}: {value.toFixed(2)}%
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Data tidak tersedia.
          </div>
        )}
      </Modal>
    </div>
  );
}
