export async function predictMelanomaAPI(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(
    "https://13b1-140-213-49-101.ngrok-free.app/predict",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Gagal mendapatkan prediksi");

  const data = await response.json();
  return data;
}
