import {Router} from "express"
import { getCustomers,postCustomers,updateCustomers,getCustomersById } from "../controllers/customers.controller.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { customerSchema } from "../schemas/auth.schemas.js"

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomersById)
customersRouter.post("/customers",validateSchema(customerSchema), postCustomers)
customersRouter.put("/customers/:id",validateSchema(customerSchema), updateCustomers)

export default customersRouter
    