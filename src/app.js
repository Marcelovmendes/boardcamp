import express from "express"
import cors from "cors"
import gamesRouter from "./routes/game.routes.js"
import customersRouter from "./routes/customers.routes.js"
import rentalsRouter from "./routes/rentals.routes.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(gamesRouter)        
app.use(customersRouter)
app.use(rentalsRouter)

const port = process.env.PORT || 5000
app.listen(port, ()=> console.log("Server is running on port " + port))