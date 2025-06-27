import { predictMelanomaAPI } from "../infrastructure/melanomaApi";
import { MelanomaPrediction } from "../domain/melanoma";

export async function predictMelanomaUseCase(imageFile) {
  const result = await predictMelanomaAPI(imageFile);
  return new MelanomaPrediction(result.prediction, result.probabilities);
}
