import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeSuspensionImage = async (base64Image: string): Promise<any> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove 'data:image/jpeg;base64,' prefix
              mimeType: 'image/jpeg',
            }
          },
          {
            text: "Identify this mountain bike suspension component (fork or shock). Return a JSON object with 'manufacturer', 'model', 'type' (Fork or Shock). If you can't identify it, return { 'error': 'Could not identify' }."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            manufacturer: { type: Type.STRING },
            model: { type: Type.STRING },
            type: { type: Type.STRING },
            error: { type: Type.STRING },
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { error: "Failed to analyze image" };
  }
};