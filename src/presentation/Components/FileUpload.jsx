export default function FileUpload({ onFileChange, fileInputRef }) {
  return (
    <label className="cursor-pointer block mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className="text-blue-700 font-medium bg-blue-100 hover:bg-blue-200 rounded px-4 py-2 inline-block transition">
        📁 Pilih dari Galeri
      </div>
    </label>
  );
}
