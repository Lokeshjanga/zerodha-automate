import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const configSchema = z.object({
  KITE_API_KEY: z.string().min(1, "KITE_API_KEY is required"),
  KITE_API_SECRET: z.string().optional(),
  KITE_ACCESS_TOKEN: z.string().optional(),
}).refine(data => data.KITE_API_SECRET || data.KITE_ACCESS_TOKEN, {
  message: "Either KITE_API_SECRET or KITE_ACCESS_TOKEN must be provided",
});

function loadConfig() {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join("\n");
    console.error("Failed to load configuration:\n" + errors);
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();
