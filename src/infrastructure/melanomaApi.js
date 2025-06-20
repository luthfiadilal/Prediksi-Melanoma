export async function predictMelanomaAPI(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(
    "https://fbfe-2001-448a-3070-1533-8d4e-f0df-569a-7e49.ngrok-free.app/predict",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Gagal mendapatkan prediksi");

  const data = await response.json();
  return data;
}
