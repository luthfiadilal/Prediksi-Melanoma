import { useState, useRef, useEffect } from "react";
import { predictMelanomaUseCase } from "../../application/predictMelanoma";
import Modal from "../Components/Modal";
import Spinner from "../Components/Spinner";

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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  // Get available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        // Minta izin kamera terlebih dahulu
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameraDevices(videoDevices);

        if (videoDevices.length > 0) {
          setActiveCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error accessing cameras:", err);
        alert(`Error: ${err.message}`);
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
      // Stop previous stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: isMobile ? 640 : 1280 },
          height: { ideal: isMobile ? 480 : 720 },
          facingMode: isMobile ? "environment" : "user",
        },
      };

      console.log("Attempting to start camera with constraints:", constraints);

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      console.log("Successfully got media stream");

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .catch((err) => console.error("Error playing video:", err));
        };
      }

      setShowCamera(true);

      // Update active camera
      const tracks = mediaStream.getVideoTracks();
      if (tracks.length > 0) {
        const settings = tracks[0].getSettings();
        console.log("Active camera settings:", settings);
        setActiveCamera(settings.deviceId);
      }
    } catch (err) {
      console.error("Failed to start camera:", err);
      alert(`Gagal mengakses kamera: ${err.name}\n${err.message}`);

      // Fallback untuk browser yang tidak support deviceId
      if (err.name === "OverconstrainedError" && deviceId) {
        console.log("Trying fallback without deviceId");
        await startCamera(); // Coba lagi tanpa deviceId spesifik
        return;
      }
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
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat prediksi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Apakah tombol ganti kamera boleh muncul
  const canSwitchCamera = isMobile && cameraDevices.length > 1;

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* Left Section */}
      <div className="flex-1 text-center md:text-left mb-8 md:mb-0">
        <img
          src="/example-ui.png"
          alt="Melanoma Example"
          className="w-64 mx-auto md:mx-0 rounded-lg shadow-md"
        />
        <h1 className="text-4xl font-extrabold mt-6 leading-tight text-gray-800">
          Deteksi <span className="text-blue-600">Melanoma</span> Kulit
        </h1>
        <p className="text-gray-600 mt-3 max-w-md">
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
                  className="w-full h-auto max-h-64 mx-auto rounded-md"
                />
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={takePicture}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Ambil Foto
                  </button>
                  {canSwitchCamera && (
                    <button
                      type="button"
                      onClick={switchCamera}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Ganti Kamera
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Batal
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
                  onClick={() => startCamera()}
                  disabled={cameraLoading}
                  className={`text-blue-700 font-medium bg-blue-100 hover:bg-blue-200 rounded px-4 py-2 transition ${
                    cameraLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {cameraLoading ? "Membuka Kamera..." : "📷 Buka Kamera"}
                </button>
                {cameraDevices.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Kamera tidak terdeteksi. Pastikan perangkat memiliki kamera
                    dan izin diberikan.
                  </p>
                )}
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
            {isLoading ? <Spinner /> : "Deteksi Sekarang"}
          </button>
        </form>
      </div>

      {/* Modal Result */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Hasil Prediksi Melanoma"
      >
        {result ? (
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold">{result.prediction}</p>
            <p className="text-gray-600">{result.details}</p>
          </div>
        ) : (
          <p>Data tidak tersedia.</p>
        )}
      </Modal>
    </div>
  );
}
