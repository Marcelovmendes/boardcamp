import {Router} from "express"
import { getRetails,postRetails } from "../controllers/retails.controller.js"

const retailsRouter = Router()

retailsRouter.get("/retails", getRetails)
retailsRouter.post("/retails",postRetails)

export default retailsRouter