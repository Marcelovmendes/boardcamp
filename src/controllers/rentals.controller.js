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
