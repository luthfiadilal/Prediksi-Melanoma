export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="mt-4 p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold">Hasil Prediksi:</h2>
      <p className="text-lg text-red-600">{result.prediction}</p>
    </div>
  );
}
