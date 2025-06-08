import { useState, useRef, useEffect } from "react";
import { predictMelanomaUseCase } from "../../application/predictMelanoma";
import Modal from "../Components/Modal";
import Spinner from "../Components/Spinner";
import { Icon } from "@iconify/react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [activeCamera, setActiveCamera] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);

  // Deteksi mobile atau desktop
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  // Di console setelah kamera terbuka:

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  useEffect(() => {
    console.log("Stream changed:", stream);
    if (stream && videoRef.current) {
      console.log("Video tracks:", stream.getVideoTracks());
      console.log("Stream active:", stream.active);
    }
  }, [stream]);

  // Get available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        // Minta izin dengan constraints sederhana
        const tempStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        tempStream.getTracks().forEach((track) => track.stop()); // Stop segera setelah dapat izin

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameraDevices(videoDevices);

        if (videoDevices.length > 0) {
          setActiveCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Camera access error:", err);
        alert(`Izin kamera diperlukan. Error: ${err.message}`);
      }
    };

    getCameras();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Start camera with selected device or default based on device type
  const startCamera = async (deviceId = null) => {
    setCameraLoading(true);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Coba 3 level fallback secara berurutan
      const constraintsAttempts = [
        // Attempt 1: Dengan deviceId jika ada
        deviceId ? { video: { deviceId: { exact: deviceId } } } : null,

        // Attempt 2: FacingMode environment (kamera belakang)
        { video: { facingMode: { exact: "environment" } } },

        // Attempt 3: Constraints paling dasar
        { video: true },
      ].filter(Boolean);

      let lastError = null;

      for (const constraints of constraintsAttempts) {
        try {
          console.log("Trying constraints:", constraints);
          const mediaStream = await navigator.mediaDevices.getUserMedia(
            constraints
          );
          setStream(mediaStream);

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await new Promise((resolve) => {
              videoRef.current.onloadedmetadata = resolve;
            });
            await videoRef.current.play();
          }

          setShowCamera(true);
          return; // Berhasil, keluar dari fungsi
        } catch (err) {
          lastError = err;
          console.warn(`Attempt failed:`, err);
          // Lanjut ke attempt berikutnya
        }
      }

      // Jika semua attempt gagal
      throw lastError || new Error("All camera attempts failed");
    } catch (err) {
      console.error("Final camera error:", err);

      // Pesan error lebih spesifik
      let errorMessage = "Gagal mengakses kamera";
      if (err.name === "NotReadableError") {
        errorMessage =
          "Kamera sedang digunakan aplikasi lain. Tutup aplikasi lain yang mungkin menggunakan kamera.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "Mode kamera tidak didukung. Coba ganti kamera.";
      }

      alert(`${errorMessage}\nDetail: ${err.message}`);
    } finally {
      setCameraLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // Switch between cameras (hanya aktif di mobile dan jika lebih dari 1 kamera)
  const switchCamera = () => {
    if (!isMobile) return; // nonaktifkan di desktop
    if (cameraDevices.length < 2) return;

    const currentIndex = cameraDevices.findIndex(
      (device) => device.deviceId === activeCamera
    );
    const nextIndex = (currentIndex + 1) % cameraDevices.length;
    startCamera(cameraDevices[nextIndex].deviceId);
  };

  // Take picture from camera
  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          setImage(file);
          setPreview(URL.createObjectURL(blob));
          setResult(null);
          stopCamera();
        },
        "image/jpeg",
        0.95
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    setResult(null);

    try {
      const prediction = await predictMelanomaUseCase(image);
      setResult(prediction);
      console.log("Hasil Prediksi:", prediction); // Tampilkan di console
      setShowModal(true); // Jangan tampilkan modal dulu
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat prediksi.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices.length === 0) {
        throw new Error("Tidak ada kamera yang terdeteksi");
      }

      // Coba akses kamera secara singkat
      const tempStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      tempStream.getTracks().forEach((track) => track.stop());

      return true;
    } catch (err) {
      console.error("Camera check failed:", err);
      return false;
    }
  };

  // Panggil sebelum memulai kamera
  const handleStartCamera = async () => {
    const isAvailable = await checkCameraAvailability();
    if (!isAvailable) {
      alert("Kamera tidak tersedia atau sedang digunakan aplikasi lain");
      return;
    }
    startCamera();
  };

  // Apakah tombol ganti kamera boleh muncul
  const canSwitchCamera = isMobile && cameraDevices.length > 1;

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100 p-6 md:px-[100px]">
      {/* Left Section */}
      <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
        {/* <img
          src="/example-ui.png"
          alt="Melanoma Example"
          className="w-64 mx-auto md:mx-0 rounded-lg shadow-md"
        /> */}
        <h1 className="md:text-[48px] text-[32px] font-extrabold mt-6 leading-tight text-gray-800">
          Deteksi <span className="text-blue-600">Melanoma</span> Kulit
        </h1>
        <p className="text-gray-600 md:text-[22px] mt-3 max-w-md">
          Unggah gambar kulit Anda atau gunakan kamera untuk mendeteksi potensi
          melanoma secara instan.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
            {/* Camera View */}
            {showCamera ? (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full md:h-[480px] h-[400px] mx-auto rounded-md bg-gray-800 object-cover"
                />

                <div className="flex justify-center flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={takePicture}
                    className="bg-white cursor-pointer border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-opacity-50 flex items-center space-x-2"
                  >
                    <Icon icon="solar:camera-bold" width="20" height="20" />
                    <span>Ambil Foto</span>
                  </button>
                  {canSwitchCamera && (
                    <button
                      type="button"
                      onClick={switchCamera}
                      className="bg-white cursor-pointer border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 flex items-center space-x-2"
                    >
                      <Icon
                        icon="solar:refresh-circle-bold"
                        width="20"
                        height="20"
                      />
                      <span>Ganti Kamera</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-white cursor-pointer border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-opacity-50 flex items-center space-x-2"
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
                {/* File Upload Button */}
                <label className="cursor-pointer block mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <div className="text-blue-700 font-medium bg-blue-100 hover:bg-blue-200 rounded px-4 py-2 inline-block transition">
                    📁 Pilih dari Galeri
                  </div>
                </label>

                {/* Camera Button */}
                <button
                  type="button"
                  onClick={handleStartCamera} // Ganti dari startCamera langsung
                  disabled={cameraLoading}
                  className={`text-blue-700 font-medium bg-blue-100 hover:bg-blue-200 rounded px-4 py-2 transition ${
                    cameraLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {cameraLoading ? "Membuka Kamera..." : "📷 Buka Kamera"}
                </button>
              </>
            )}

            {/* Preview Image */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !image}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition disabled:opacity-50`}
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

      {/* Modal Result */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Hasil Prediksi Melanoma"
      >
        {result ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold shadow">
              🧬
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
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
              <p className="text-sm text-gray-500">{result.details}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
            >
              Tutup
            </button>
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
