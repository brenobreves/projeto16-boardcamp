import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/games.schema.js";
import { createGame, getGames } from "../controllers/games.controller.js";

const gamesRouter = Router()

gamesRouter.get("/games", getGames)
gamesRouter.post("/games", validateSchema(gameSchema), createGame)

export default gamesRouter