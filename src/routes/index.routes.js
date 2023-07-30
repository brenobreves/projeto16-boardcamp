import { Router } from "express";
import customerRouter from "./customers.routes.js";
import gamesRouter from "./games.routes.js";
import rentalsRouter from "./rentals.routes.js";

const router = Router()

router.use(customerRouter)
router.use(gamesRouter)
router.use(rentalsRouter)

export default router