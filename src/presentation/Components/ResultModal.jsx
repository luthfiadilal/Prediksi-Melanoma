import Modal from "./Modal";

export default function ResultModal({ isOpen, onClose, result }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hasil Prediksi Melanoma">
      {result ? (
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">{result.prediction}</p>
          <p className="text-gray-600">{result.details}</p>
        </div>
      ) : (
        <p>Data tidak tersedia.</p>
      )}
    </Modal>
  );
}
