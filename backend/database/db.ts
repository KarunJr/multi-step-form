import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const credentials = {
  user: process.env.PG_USER, //postgres
  host: process.env.PG_HOST, //localhost
  database: process.env.PG_DATABASE, //companyDB
  password: process.env.PG_PASSWORD, //root
  port: Number(process.env.PG_PORT), //5432
};

const pool = new Pool(credentials);
export default pool;

export async function checkDbConnection() {
  try {
    const res = await pool.query(`SELECT 1`);
    console.log("Connected to PostgreSQL", res.rows);
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}
