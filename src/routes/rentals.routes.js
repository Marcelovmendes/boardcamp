import {Router} from "express"
import { deleteRentalById, finishRental, getRentals, postRentals } from "../controllers/rentals.controller.js"
import { validadeFinishRental, validateRentals } from "../middlewares/validadeteRentals.middlewares.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals",validateRentals,postRentals)
rentalsRouter.post("/rentals/:id/return",validadeFinishRental,finishRental)
rentalsRouter.delete("/rentals/:id",deleteRentalById)
export default rentalsRouter