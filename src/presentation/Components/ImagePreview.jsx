export default function ImagePreview({ preview }) {
  if (!preview) return null;

  return (
    <div className="mt-4">
      <img
        src={preview}
        alt="Preview"
        className="mx-auto max-h-48 rounded-md border"
      />
    </div>
  );
}
