import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
    PORT: z.string(),
    DATABASE_URL: z.string().url()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    throw new Error("Invalid environment variables: " + JSON.stringify(parsed.error.format()));
}

export const env = parsed.data;

