import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  try {
    const customers = await db.query("SELECT id, name, phone, cpf, TO_CHAR(birthday, 'YYYY-MM-DD') as birthday FROM customers");
    if (!customers.rows.length) return res.status(404).send("No customers found");

    res.send(customers.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getCustomersById(req, res) {
  try {
    const { id } = req.params;
    const customer = await db.query("SELECT * FROM customers WHERE id = $1", [
      id,
    ]);
    if (!customer.rows.length) return res.sendStatus(404);
    res.send(customer.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
}
export async function postCustomers(req, res) {
  try {
    const { name, phone, cpf, birthday } = req.body;
    const birthdayObj = new Date(birthday);
    const birthdayFormatted = birthdayObj.toISOString().substring(0, 10);
    const existingCustomer = await db.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [cpf]
    );
    if (existingCustomer.rows.length) return res.sendStatus(409);
    await db.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3,$4)",
      [name, phone, cpf, birthdayFormatted]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function updateCustomers(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    const birthdayObj = new Date(birthday);
    const birthdayFormatted = birthdayObj.toISOString().substring(0, 10);
    const existingCustomer = await db.query(
        "SELECT * FROM customers WHERE cpf = $1 AND id != $2",
        [cpf, id]
      );
      if (existingCustomer.rowCount>0) return res.sendStatus(409);
    await db.query(
      "UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5",
      [name, phone, cpf, birthdayFormatted, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
}
