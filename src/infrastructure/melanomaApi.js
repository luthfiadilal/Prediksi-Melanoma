export async function predictMelanomaAPI(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch("https://b9a9-2001-448a-2082-b8ae-254f-e890-d698-f19c.ngrok-free.app/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Gagal mendapatkan prediksi");

  const data = await response.json();
  return data;
}
