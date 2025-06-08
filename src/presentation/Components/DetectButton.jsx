import Spinner from "../Components/Spinner";

export default function DetectButton({ isLoading, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition disabled:opacity-50"
    >
      {isLoading ? <Spinner /> : "Deteksi Sekarang"}
    </button>
  );
}
