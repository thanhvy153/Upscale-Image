import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { UpscaleFactor } from '../types';

// FIX: Per coding guidelines, the API key must be obtained from process.env.API_KEY and used directly.
// The execution environment is assumed to have this variable pre-configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    const prompt = `
**ROLE**: You are a highly specialized and expert Image Super-Resolution AI, designed for professional-grade image enhancement.

**TASK**: Your primary objective is to perform extreme image upscaling. Upscale the provided low-resolution image to exactly ${factor}x its original dimensions.

**QUALITY REQUIREMENTS (PRIORITY ORDER)**:
1.  **Detail Reconstruction**: Intelligently reconstruct and enhance fine-grained details, textures (e.g., skin, fabric, foliage), and intricate patterns. Focus on preserving naturalness and avoiding an overly artificial or smoothed appearance.
2.  **Sharpness & Clarity**: Increase overall sharpness and clarity without introducing halos, ringing artifacts, or pixelation. Edges should be crisp and well-defined.
3.  **Noise & Artifact Reduction**: Effectively reduce and eliminate compression artifacts (e.g., JPEG artifacts), digital noise, and color banding, especially in smooth areas.
4.  **Color & Tone Preservation**: Maintain the original color accuracy, tonal balance, and dynamic range of the image. Avoid color shifts or saturation changes.
5.  **Photorealism**: Ensure the upscaled image maintains a high degree of photorealism, appearing as if it was originally captured at the higher resolution.

**CRITICAL CONSTRAINTS (DO NOT VIOLATE)**:
*   **NO GENERATION OF NEW CONTENT**: Absolutely do NOT add any new objects, elements, or alter the fundamental composition, context, or subject matter of the original image. This is an enhancement task, not a generative one.
*   **NO STYLE CHANGE**: Do not change the artistic style, lighting, or overall mood of the image.
*   **PRESERVE ORIGINAL CHARACTER**: The upscaled image must be a faithful, higher-resolution representation of the input, retaining its unique characteristics.

**OUTPUT FORMAT**: Provide ONLY the upscaled image data as the final output. Do not include any text, descriptions, or metadata.

**SPECIAL CONSIDERATION FOR ${factor}x UPSCALING**: For this ${factor}x upscale, pay extra attention to maintaining structural integrity and preventing any 'watercolor' or 'smudged' effects that can occur at high magnification. Focus on generating plausible, high-frequency details.
`;

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
