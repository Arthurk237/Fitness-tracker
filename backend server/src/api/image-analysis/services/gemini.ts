import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const GEMINI_INVALID_KEY_ERROR = "GEMINI_API_KEY_INVALID";
const GEMINI_MISSING_KEY_ERROR = "GEMINI_API_KEY_MISSING";

const getGeminiApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(GEMINI_MISSING_KEY_ERROR);
  }

  return apiKey;
};

export const analyzeImage = async (filePath: string) => {
  try {
    const base64ImageFile = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      { text: "Extract the food name and estimated calories from this image in a JSON object." },
    ];

    const config = {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
          calories: { type: "number" },
        },
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config,
    });

    return JSON.parse(response.text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("API_KEY_INVALID")) {
      throw new Error(GEMINI_INVALID_KEY_ERROR);
    }

    throw error;
  }
};

export { GEMINI_INVALID_KEY_ERROR, GEMINI_MISSING_KEY_ERROR };
