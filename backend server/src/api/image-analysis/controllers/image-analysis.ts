import { Context } from "koa";
import {analyzeImage, GEMINI_INVALID_KEY_ERROR, GEMINI_MISSING_KEY_ERROR, } from "../services/gemini";

export default {
  async analyze(ctx: Context) {
    const imageFiles = ctx.request.files as
      | {
          images?: { filepath?: string } | Array<{ filepath?: string }>;
          image?: { filepath?: string } | Array<{ filepath?: string }>;
        }
      | undefined;

    const uploadedFile = imageFiles?.images ?? imageFiles?.image;
    if (!uploadedFile) return ctx.badRequest("No image uploaded");

    const firstFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    const filePath = firstFile?.filepath;

    if (!filePath) {
      return ctx.badRequest("Invalid image upload");
    }

    try {
      const result = await analyzeImage(filePath);
      return ctx.send({ success: true, result });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message === GEMINI_MISSING_KEY_ERROR || message === GEMINI_INVALID_KEY_ERROR) {
        return ctx.badRequest("Gemini API key is missing or invalid. Set GEMINI_API_KEY in backend server/.env and restart Strapi.");
      }

      return ctx.internalServerError("Analysis failed", { error: message });
    }
  },
};
