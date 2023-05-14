import { db } from "../database/database.connection.js";

export async function getRetails(req, res) {
  try {
    const retails = await db.query("SELECT * FROM retails");
    if (!retails.rows.length) return res.status(404).send("No retails found");
    res.send(retails.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}
