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
  const [cameraLoading, setCameraLoading] = useState(false);

  // Di dalam startCamera(), sebelum getUserMedia
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    console.log("Perangkat mobile terdeteksi, cek kamera belakang");
    // Tambahkan logika khusus untuk mobile di sini
  }

  // Tambahkan di awal komponen
  useEffect(() => {
    console.log("Device Info:", {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isMobile: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    });
  }, []);
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      // Cleanup kamera saat komponen unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Start camera langsung dengan environment
  const startCamera = async () => {
    setCameraLoading(true);
    try {
      // Hentikan stream sebelumnya jika ada
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      console.log("Mencoba mengakses kamera...");

      // 1. Coba dapatkan daftar perangkat kamera terlebih dahulu
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      console.log("Perangkat Kamera Tersedia:", videoDevices);

      // 2. Cari kamera belakang (prioritaskan environment)
      const constraints = {
        video: {
          width: { ideal: isMobile ? 640 : 1280 },
          height: { ideal: isMobile ? 480 : 720 },
          facingMode: { ideal: "environment" },
        },
      };

      // 3. Jika di mobile, coba gunakan deviceId kamera belakang jika ada
      if (isMobile && videoDevices.length > 1) {
        const backCamera = videoDevices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear")
        );

        if (backCamera) {
          constraints.video = {
            ...constraints.video,
            deviceId: { exact: backCamera.deviceId },
          };
          console.log(
            "Menggunakan kamera belakang dengan deviceId:",
            backCamera.deviceId
          );
        }
      }

      // 4. Dapatkan media stream
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();

      console.log("Kamera Berhasil Diakses:", {
        facingMode: settings.facingMode || "tidak terdeteksi",
        label: videoTrack.label,
        resolution: `${settings.width}x${settings.height}`,
      });

      setStream(mediaStream);

      // 5. Handle video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // Tambahkan event listener untuk error
        videoRef.current.onerror = (e) => {
          console.error("Error pada video element:", e);
        };

        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current
            .play()
            .then(() => console.log("Video berhasil diputar"))
            .catch((e) => console.error("Gagal memutar video:", e));
        };

        // Fallback untuk Android
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            videoRef.current.play().catch((e) => {
              console.error("Fallback play error:", e);
            });
          }
        }, 1000);
      }

      setShowCamera(true);
    } catch (error) {
      console.error("Error mengakses kamera:", error);

      // Fallback ke kamera depan jika gagal
      try {
        console.log("Coba fallback ke kamera depan...");
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }
        setShowCamera(true);
      } catch (fallbackError) {
        console.error("Fallback juga gagal:", fallbackError);
        alert("Tidak dapat mengakses kamera: " + fallbackError.message);
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

  // Take picture from camera
  const takePicture = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
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
    } else {
      alert("Kamera belum siap, tunggu sebentar dan coba lagi");
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
      console.log("Hasil Prediksi:", prediction);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat prediksi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle start camera dengan pengecekan
  const handleStartCamera = async () => {
    await startCamera();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100 p-6 md:px-[100px]">
      {/* Left Section */}
      <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
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
                  onClick={handleStartCamera}
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
