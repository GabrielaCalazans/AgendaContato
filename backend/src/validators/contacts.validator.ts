import { z } from "zod";

// Validação para telefone brasileiro: apenas dígitos, 10-11 caracteres
const phoneRegex = /^\d{10,11}$/;
// Validação para nome: apenas letras (com acentos) e espaços
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/

export const CreateContactSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .regex(nameRegex, { message: "Name can only contain letters and spaces" }),
    email: z.string().email({ message: "Invalid email" }),
    phone: z
        .string()
        .optional()
        .refine((val) => (val === undefined ? true : phoneRegex.test(val)), {
            message: "Invalid phone format",
        }),
    // Normalize and validate birthdate: accept ISO string or Date-like string, convert to Date
    // Using preprocess so the parsed value will be a Date instance for downstream Prisma usage
    birthdate: z
        .preprocess((val) => {
            if (val === undefined || val === null) return undefined;
            if (val instanceof Date) return val;
            if (typeof val === "string") {
                // Try to parse; if invalid, return original value so z.date() will fail
                const parsed = Date.parse(val);
                return Number.isNaN(parsed) ? val : new Date(val);
            }
            return val;
        }, z.date().optional()),
    // preferredContactTime: accept Date, ISO datetime, or time-only strings like "HH:mm" or "HH:mm:ss"
    preferredContactTime: z.preprocess((val) => {
        if (val === undefined || val === null) return undefined;
        if (val instanceof Date) return val;
        if (typeof val === "string") {
            // time-only like 14:30 or 14:30:00
            const timeOnly = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
            if (timeOnly.test(val)) {
                const parts = val.split(":").map((p) => Number(p));
                const now = new Date();
                now.setHours(parts[0]);
                now.setMinutes(parts[1]);
                now.setSeconds(parts[2] ?? 0);
                now.setMilliseconds(0);
                return now;
            }
            // try full ISO datetime parse
            const parsed = Date.parse(val);
            return Number.isNaN(parsed) ? val : new Date(val);
        }
        return val;
    }, z.date().optional()),
});

// Make schema strict so unknown keys cause validation error
export const CreateContactSchemaStrict = CreateContactSchema.strict();

export const UpdateContactSchema = CreateContactSchema.partial().strict();
