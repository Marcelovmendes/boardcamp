import { db } from "../database/database.connection.js";
export async function getRentals(req, res) {
    try {
      const rentals = await db.query(`
        SELECT
          r.id,
          r.customer_id as "customerId",
          r.game_id as "gameId",
          TO_CHAR(r.rent_date, 'YYYY-MM-DD') as "rentDate",
          r.days_rented as "daysRented",
          TO_CHAR(r.return_date, 'YYYY-MM-DD') as "returnDate",
          r.original_price as "originalPrice",
          r.delay_fee as "delayFee",
          c.id as "customer.id",
          c.name as "customer.name",
          g.id as "game.id",
          g.name as "game.name"
        FROM rentals r
        JOIN customers c ON r.customer_id = c.id
        JOIN games g ON r.game_id = g.id
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
          customer: {
            id: rental.customer.id,
            name: rental.customer.name,
          },
          game: {
            id: rental.game.id,
            name: rental.game.name,
          },
        };
      });
  
      res.send(formattedRentals);
    } catch (err) {
      res.status(500).send(err);
    }
  }
export async function postRentals(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;

    const customer = await db.query("SELECT * FROM customers WHERE id = $1", [
      customerId,
    ]);
    if (customer.rows.length === 0) {
      return res.status(400).send("Invalid customerId");
    }

    const game = await db.query("SELECT * FROM games WHERE id = $1", [gameId]);
    if (game.rows.length === 0) return res.status(400).send("Invalid gameId");


    const rentalsCount = await db.query(
      "SELECT COUNT(*) FROM rentals WHERE game_id = $1 AND return_date IS NULL",
      [gameId]
    );
    const gameStock = await db.query("SELECT stockTotal FROM games WHERE id = $1", [gameId]);
    if (rentalsCount.rows[0].count >= gameStock.rows[0].stockTotal) {
      return res.status(400).send("No available games for rental");
    }
    const rentDate = new Date().toISOString().substring(0, 10);
    const originalPrice = daysRented * game.rows[0].pricePerDay;
   
    if (daysRented <= 0) return res.status(400).send("Invalid daysRented");

    
    await db.query(
      "INSERT INTO rentals (customer_id, game_id, rent_date, days_rented, original_price) VALUES ($1, $2, $3, $4, $5)",
      [customerId, gameId, rentDate, daysRented, originalPrice]);

    res.sendStatus(201);
}catch(err){
  res.status(500).send(err)
}
}