import express from "express"
import cors from "cors"
import gamesRouter from "./routes/game.routes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(gamesRouter)

const PORT = 5000
app.listen(PORT, ()=> console.log("Server is running on port " + PORT))