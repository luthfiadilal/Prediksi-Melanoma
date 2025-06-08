export async function predictMelanomaAPI(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(
    "https://6c1c-2001-448a-3070-1533-9dd7-143c-73-c405.ngrok-free.app/predict",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Gagal mendapatkan prediksi");

  const data = await response.json();
  return data;
}
