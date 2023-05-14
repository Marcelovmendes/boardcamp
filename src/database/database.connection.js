import pg from "pg"

const {Pool} = pg

const connection =({
    connectionString: process.env.DATABASE_URL,
  });

  export const db = new Pool(connection);