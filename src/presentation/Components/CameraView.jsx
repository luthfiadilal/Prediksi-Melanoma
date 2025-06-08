import { useRef } from "react";

export default function CameraView({
  isMobile,
  cameraDevices,
  activeCamera,
  setActiveCamera,
  showCamera,
  setShowCamera,
  stream,
  setStream,
  cameraLoading,
  setCameraLoading,
  setImage,
  setPreview,
  setResult,
}) {
  const videoRef = useRef(null);

  // Start camera
  const startCamera = async (deviceId = null) => {
    setCameraLoading(true);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
          ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
          width: { ideal: isMobile ? 640 : 1280 },
          height: { ideal: isMobile ? 480 : 720 },
          facingMode: isMobile ? "environment" : "user",
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(console.error);
        };
        videoRef.current.onerror = () => {
          console.error("Video element error:", videoRef.current.error);
        };
      }

      setShowCamera(true);

      const tracks = mediaStream.getVideoTracks();
      if (tracks.length > 0) {
        const settings = tracks[0].getSettings();
        setActiveCamera(settings.deviceId);
      }
    } catch (err) {
      console.error("Failed to start camera:", err);
      alert(`Gagal mengakses kamera: ${err.name}\n${err.message}`);

      if (err.name === "OverconstrainedError" && deviceId) {
        // fallback tanpa deviceId
        await startCamera();
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

  // Switch camera
  const switchCamera = () => {
    if (!isMobile || cameraDevices.length < 2) return;

    const currentIndex = cameraDevices.findIndex(
      (device) => device.deviceId === activeCamera
    );
    const nextIndex = (currentIndex + 1) % cameraDevices.length;
    startCamera(cameraDevices[nextIndex].deviceId);
  };

  // Take picture
  const takePicture = () => {
    if (!videoRef.current) return;

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
  };

  const canSwitchCamera = isMobile && cameraDevices.length > 1;

  return (
    <div className="space-y-4">
      {showCamera ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto max-h-64 mx-auto rounded-md bg-black"
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
        </>
      ) : (
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
      )}
    </div>
  );
}
