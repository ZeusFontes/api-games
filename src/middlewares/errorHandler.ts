import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  // Erro de validação Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      issues: error.issues,
    });
  }

  // Erro conhecido do Prisma
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Jogo não encontrado." });
    }
  }

  // Erro padrão
  return res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
};