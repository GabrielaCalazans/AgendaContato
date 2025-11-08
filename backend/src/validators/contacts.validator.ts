import { z } from "zod";

// Validação para telefone: permite dígitos, espaços, parênteses, +, -, . e tamanho razoável
const phoneRegex = /^\+?[0-9\s().-]{7,20}$/;

export const CreateContactSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
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
});

// Make schema strict so unknown keys cause validation error
export const CreateContactSchemaStrict = CreateContactSchema.strict();

export const UpdateContactSchema = CreateContactSchema.partial().strict();
