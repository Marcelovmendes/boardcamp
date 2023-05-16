import { db } from "../database/database.connection.js";

export async function validateRentals(req, res, next) {
  const { customerId, gameId } = req.body;
  const games = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
  if (games.rowCount === 0) return res.status(400).send("Invalid game");

  const customers = await db.query(`SELECT * FROM customers WHERE id=$1;`, [
    customerId,
  ]);
  if (customers.rowCount === 0)
    return res.status(400).send("Invalid customerId!");

  const checkGameStock = await db.query(
    `
 SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;
`,
    [gameId]
  );
  if (checkGameStock.rowCount >= games.rows[0].stockTotal)
    return res.status(400).send(" Not enough stock");

  res.locals.pricePerDay = games.rows[0].pricePerDay;
  next();
}

export async function validadeFinishRental(req, res, next) {
  const { id } = req.params;
  const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
  if (rental.rows[0].returnDate !== null)  return res.status(400).send(" Rental already finished");
  if (rental.rowCount === 0) return res.status(404).send(" Rental not found");


  res.locals.rentDate = rental.rows[0].rentDate;
  res.locals.daysRented =rental.rows[0].daysRented;
  res.locals.pricePerDay = rental.rows[0].originalPrice / rental.rows[0].daysRented;
  next();
}
