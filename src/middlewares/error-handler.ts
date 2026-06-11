import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/http-error";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    message: "Rota não encontrada."
  });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos.",
      errors: error.flatten()
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      return res.status(409).json({
        message: "Registro já existente."
      });
    }

    if (prismaError.code === "P2025") {
      return res.status(404).json({
        message: "Registro não encontrado."
      });
    }
  }

  console.error(error);
  return res.status(500).json({
    message: "Erro interno do servidor."
  });
}
