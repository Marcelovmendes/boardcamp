import { db } from "../database/database.connection.js";
import dayjs from "dayjs"
export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`
      SELECT r.id, r."gameId", r."customerId", r."rentDate", r."daysRented", r."returnDate", r."originalPrice", r."delayFee",
        (SELECT JSON_BUILD_OBJECT('id', c.id, 'name', c.name) FROM customers c WHERE c.id = r."customerId") AS customer,
        (SELECT JSON_BUILD_OBJECT('id', g.id, 'name', g.name) FROM games g WHERE g.id = r."gameId") AS game
      FROM rentals r 
    `);

    const formattedRentals = rentals.rows.map((rental) => {
      return {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: rental.customer,
        game: rental.game,
      };
    });
    return res.send(formattedRentals);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postRentals(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;
     console.log(gameId)
   const {pricePerDay} = res.locals
    const rentDate = new Date().toISOString().substring(0, 10);
    if (daysRented <= 0) return res.status(400).send("Invalid daysRented");
    await db.query(`
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, $4, null, $5, null);
    `, [customerId,gameId ,rentDate , daysRented,pricePerDay*daysRented]);

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}
export async function finishRental(req, res) {
  const { id } = req.params;
  const { pricePerDay, daysRented, rentDate } = res.locals;
  console.log(daysRented, rentDate, pricePerDay) 
  let delayFee = null;

  const today = dayjs().format("YYYY-MM-DD")
  const difference =dayjs(today).diff(dayjs(rentDate), "day") - daysRented
  console.log(difference,'difference') 

  if(difference>0 ){
    delayFee = difference * pricePerDay
  }

  try {
    await db.query(
      'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;',
      [dayjs().format('YYYY-MM-DD'), delayFee, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function deleteRentalById (req,res){
  const {id} = req.params
  try {
    await db.query('DELETE FROM rentals WHERE id = $1',[id])
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(err.message)
  }
}