import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
  try {
    const games = await db.query("SELECT * FROM games");
   if (!games.rows.length) return res.status(404).send("No games found");
    res.send(games.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}
export async function postGames(req,res){

  try{
    const { name, image, stockTotal, pricePerDay } = req.body;
    if(stockTotal <=0 || pricePerDay <=0)  return res.sendStatus(400)

    const existingGame = await db.query("SELECT * FROM games WHERE name = $1", [name]);
    if(existingGame.rows.length) return res.sendStatus(409)

    await db.query("INSERT INTO games (name, image, \"stockTotal\", \"pricePerDay\") VALUES ($1, $2, $3, $4)", [
      name,
      image,
      stockTotal,
      pricePerDay,
    ]);

    res.sendStatus(201)
  }catch(err){
  res.status(500).send(err)
  }
}
