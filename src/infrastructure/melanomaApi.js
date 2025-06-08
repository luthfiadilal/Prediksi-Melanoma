export async function predictMelanomaAPI(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(
    "https://f721-2001-448a-3070-1533-f466-555f-1435-cba2.ngrok-free.app/predict",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Gagal mendapatkan prediksi");

  const data = await response.json();
  return data;
}
