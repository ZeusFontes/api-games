import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllGames = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const games = await prisma.game.findMany();
    res.json(games);
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: Number(id) },
    });
    res.json(game);
  } catch (error) {
    next(error);
  }
};

export const createGame = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, platform } = req.body;
    const newGame = await prisma.game.create({ data: { title, platform } });
    res.status(201).json(newGame);
  } catch (error) {
    next(error);
  }
};
