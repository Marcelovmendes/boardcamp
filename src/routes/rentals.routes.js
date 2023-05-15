import {Router} from "express"
import { getRentals, postRentals } from "../controllers/rentals.controller.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals",postRentals)

export default rentalsRouter