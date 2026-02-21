export async function predictMelanomaAPI(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch("https://c248-2001-448a-2083-beb7-49d7-487a-77ff-56c4.ngrok-free.app/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Gagal mendapatkan prediksi");

  const data = await response.json();
  return data;
}
