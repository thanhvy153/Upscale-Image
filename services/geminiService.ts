
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { UpscaleFactor, UpscalingGoal, UpscaleMode } from '../types';

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

const getGoalSpecificInstructions = (goal: UpscalingGoal): string => {
  switch (goal) {
    case 'details':
      return `\n**SPECIALIZATION**: Focus intensely on reconstructing high-frequency details. Prioritize texture, fine lines, and micro-details above all else. The goal is maximum clarity and definition.`;
    case 'smoothness':
      return `\n**SPECIALIZATION**: Prioritize noise reduction and creating smooth, clean gradients. Aggressively remove compression artifacts and digital noise, even at the slight risk of losing some imperceptible micro-texture. The goal is a pristine, artifact-free image.`;
    case 'balanced':
    default:
      return ''; // No special instructions for balanced
  }
}

const standardPrompt = `
**ROLE**: You are a highly specialized and expert Image Super-Resolution AI, designed for professional-grade image enhancement. Your goal is to function like state-of-the-art models such as Real-ESRGAN.

**TASK**: Your primary objective is to perform extreme image upscaling. Upscale the provided low-resolution image to exactly ${'${factor}'}x its original dimensions.

**QUALITY REQUIREMENTS (PRIORITY ORDER)**:
1.  **Detail Reconstruction & Plausibility**: Intelligently reconstruct and enhance fine-grained details, textures (e.g., skin, fabric, foliage), and intricate patterns. Generate plausible details that are consistent with the rest of the image. Avoid an overly artificial or smoothed appearance.
2.  **Sharpness & Clarity**: Increase overall sharpness and clarity without introducing halos, ringing artifacts, or pixelation. Edges should be crisp and well-defined.
3.  **Noise & Artifact Reduction**: Effectively reduce and eliminate compression artifacts (e.g., JPEG artifacts), digital noise, and color banding, especially in smooth areas.
4.  **Color & Tone Preservation**: Maintain the original color accuracy, tonal balance, and dynamic range of the image. Avoid color shifts or saturation changes.
5.  **Photorealism**: Ensure the upscaled image maintains a high degree of photorealism, appearing as if it was originally captured at the higher resolution.

**CRITICAL CONSTRAINTS (DO NOT VIOLATE)**:
*   **NO GENERATION OF NEW CONTENT**: Absolutely do NOT add any new objects, elements, or alter the fundamental composition, context, or subject matter of the original image. This is an enhancement task, not a generative one.
*   **NO STYLE CHANGE**: Do not change the artistic style, lighting, or overall mood of the image.
*   **PRESERVE ORIGINAL CHARACTER**: The upscaled image must be a faithful, higher-resolution representation of the input, retaining its unique characteristics.

**OUTPUT FORMAT**: Provide ONLY the upscaled image data as the final output. Do not include any text, descriptions, or metadata.
`;

const proPrompt = `
**ROLE**: You are an elite-tier Image Restoration and Super-Resolution Specialist AI. Your performance must exceed standard models and rival professional desktop software like Topaz Gigapixel AI. You will operate using a sophisticated multi-pass conceptual pipeline.

**TASK**: Upscale the provided low-resolution image to precisely ${'${factor}'}x its original size, executing the following conceptual pipeline with utmost precision.

**CONCEPTUAL PIPELINE**:
1.  **PASS 1: Deep Artifact & Noise Analysis**:
    *   Identify and map all forms of degradation: JPEG compression blocks, chroma noise, luminance noise, and film grain.
    *   Perform an intelligent, context-aware denoising pass. Preserve critical edge and texture data while cleaning flat and gradient areas. Do NOT apply a naive global blur.

2.  **PASS 2: Edge-Aware Detail & Texture Synthesis**:
    *   This is the core upscaling phase. Use a generative approach to synthesize plausible, high-frequency details that are coherent with the image's content.
    *   Focus on realistic textures: skin pores, fabric weaves, foliage patterns, wood grain.
    *   Reconstruct sharp, well-defined edges without introducing harsh 'ringing' or halo artifacts.

3.  **PASS 3: Micro-Contrast & Finalization**:
    *   Subtly enhance local micro-contrast to give the image depth and a "pop" factor.
    *   Perform a final, gentle sharpening pass to ensure maximum clarity.
    *   Ensure the final output is free of any generative artifacts and maintains complete photorealism.

**QUALITY REQUIREMENTS**:
*   **Photorealism & Plausibility**: The final image must look like it was originally captured at the target high resolution. Details must be believable and internally consistent. AVOID "waxy" or "plastic" skin, and over-smoothed surfaces.
*   **Fidelity**: The output must be a faithful representation of the original in terms of color, lighting, and composition. No color shifts, no content generation or alteration.

**OUTPUT FORMAT**: Provide ONLY the final, upscaled image data. No text, no explanations, no metadata.
`;


export const upscaleImage = async (
  base64Image: string,
  mimeType: string,
  factor: UpscaleFactor,
  goal: UpscalingGoal,
  mode: UpscaleMode
): Promise<string> => {
  try {
    const basePromptTemplate = mode === 'pro' ? proPrompt : standardPrompt;
    const basePrompt = basePromptTemplate.replace(/\$\{factor\}/g, factor.toString());
    
    const prompt = basePrompt + getGoalSpecificInstructions(goal);

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