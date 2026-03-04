import pool from "./db.js";


const uuidExtenstion = await pool.query(
  `CREATE EXTENSION IF NOT EXISTS "pgcrypto"; `,
);

const createTable = async () => {
  try {
    
    await pool.query(
      `CREATE TYPE company_status AS ENUM ('draft', 'saved');`,
    );
    await pool.query(
      `CREATE TYPE nationalities AS ENUM ('Nepali', 'Indian', 'American');`,
    );
    const companyTable = await pool.query(`
                CREATE TABLE IF NOT EXISTS company(
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    company_name VARCHAR(100) NOT NULL,
                    pan_number VARCHAR(9) UNIQUE,
                    total_capital_invested INT,
                    no_of_shareholders INT,
                    status company_status DEFAULT 'draft'
                )
            `);
    const shareholdersTable = await pool.query(`
                CREATE TABLE IF NOT EXISTS shareholders(
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    first_name VARCHAR(50) NOT NULL,
                    last_name VARCHAR(50) NOT NULL,
                    nationality nationalities DEFAULT 'Nepali',
                    company_id UUID REFERENCES company(id) ON DELETE CASCADE
                )
            `);
    console.log("Table updated successfully!");
  } catch (error) {
    console.error("Error in createTable()", error);
  } finally {
    await pool.end();
  }
};
createTable();
