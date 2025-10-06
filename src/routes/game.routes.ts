import { Router } from "express";
import * as gameController from "../controllers/game.controller";
import { validator } from "../middlewares/validator";
import { createGameSchema, updateGameSchema } from "../schemas/game.schema";

export const gameRouter = Router();

gameRouter.get("/games", gameController.getAllGames);
gameRouter.get("/games/:id", gameController.getGameById);
gameRouter.post("/games", validator(createGameSchema), gameController.createGame);
