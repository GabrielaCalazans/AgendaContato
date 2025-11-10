import { ErrorRequestHandler } from "express";
import z from "zod";
import { HttpError } from "../errors/HttpError.js";
import { Prisma } from "../generated/client";

export const errorHandler: ErrorRequestHandler = (e, req, res, next) => {
    // Custom HTTP errors
    if (e instanceof HttpError) {
        return res.status(e.status).json({ message: e.message });
    }

    // Validation errors (Zod)
    if (e instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid Data Format", errors: e.issues });
    }

    // Prisma client known errors (constraint, not found, etc.)
    // https://www.prisma.io/docs/reference/api-reference/error-reference
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Record not found
        if (e.code === "P2025") {
            return res.status(404).json({ code: e.code, message: "Resource not found" });
        }

        // Unique constraint failed
        if (e.code === "P2002") {
            // meta.target typically contains the field(s) that violated the constraint
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const target = (e as any).meta?.target ?? null;
            return res.status(409).json({ code: e.code, message: "Unique constraint failed", target });
        }

        // Fallback for other known Prisma errors
        return res.status(400).json({ code: e.code, message: e.message });
    }

    // Other Errors
    if (e instanceof Error) {
        return res.status(500).json({ message: e.message });
    }

    // Unknown
    return res.status(500).json({ message: "Internal Server Error" });
};

