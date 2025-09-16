
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { UpscaleFactor } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const base64ToPart = (base64: string, mimeType: string): Part => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const upscaleImage = async (
  base64Image: string,
  mimeType: string,
  factor: UpscaleFactor
): Promise<string> => {
  try {
    const prompt = `You are an expert image processing AI. Your task is to upscale the following image to ${factor}x its original resolution. Focus on enhancing details, increasing sharpness, reducing compression artifacts, and improving overall clarity. Maintain photorealism and the original character of the image. Do not add any new elements or change the composition. Provide only the upscaled image as output.`;

    const imagePart = base64ToPart(base64Image, mimeType);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('No upscaled image was returned from the AI. The model may have refused the request.');

  } catch (error) {
    console.error("Error in Gemini API call:", error);
    throw new Error("Failed to upscale image. The AI service may be temporarily unavailable or the image format is not supported.");
  }
};
