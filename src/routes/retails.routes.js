import {Router} from "express"
import { getRetails } from "../controllers/retails.controller.js"

const retailsRouter = Router()

retailsRouter.get("/retails", getRetails)

export default retailsRouter