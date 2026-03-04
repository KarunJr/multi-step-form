import pool from "../database/db.js";
import type { Request, Response } from "express";

export async function registerCompany(req: Request, res: Response) {
  const {
    company_name,
    pan_number,
    total_capital_invested,
    no_of_shareholders,
  } = req.body;
  if (
    !company_name ||
    !pan_number ||
    !total_capital_invested ||
    !no_of_shareholders
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO company (company_name, pan_number, total_capital_invested, no_of_shareholders)
         VALUES ($1, $2, $3, $4) RETURNING id`,
      [company_name, pan_number, total_capital_invested, no_of_shareholders],
    );
    const companyId = result.rows[0].id;
    return res
      .status(201)
      .json({ success: true, message: "Company created!", companyId });
  } catch (error: unknown) {
    console.error("Error in registerCompany():", error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === "23505"
    ) {
      return res.status(400).json({
        success: false,
        message: `PAN number ${pan_number} already exists.`,
      });
    }

    return res.status(500).json({ success: false, message: "Database error" });
  }
}

export async function updateCompany(req: Request, res: Response) {
  const {
    company_id,
    company_name,
    pan_number,
    total_capital_invested,
    no_of_shareholders,
  } = req.body;

  try {
    await pool.query(
      `UPDATE company 
       SET company_name=$1, pan_number=$2, total_capital_invested=$3, no_of_shareholders=$4
       WHERE id=$5`,
      [
        company_name,
        pan_number,
        total_capital_invested,
        no_of_shareholders,
        company_id,
      ],
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}

export async function getDraftCompany(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const companyResult = await pool.query(
      `SELECT * FROM company WHERE id = $1 AND status = 'draft';`,
      [id],
    );

    if (companyResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    const company = companyResult.rows[0];

    return res.json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Error in getDraftCompany(): ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


export async function getAllCompanies(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.company_name,
        c.pan_number,
        c.total_capital_invested,
        c.no_of_shareholders,

        sh.id AS shareholder_id,
        sh.first_name,
        sh.last_name,
        sh.nationality
      FROM company AS c
      LEFT JOIN shareholders AS sh 
      ON c.id = sh.company_id
      `);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No company are registered." });
    }
    const companiesMap: any = {};

    result.rows.forEach((row) => {
      if (!companiesMap[row.id]) {
        companiesMap[row.id] = {
          id: row.id,
          companyName: row.company_name,
          panNumber: row.pan_number,
          totalCapitalInvested: row.total_capital_invested,
          numberOfShareholders: row.no_of_shareholders,
          shareholders: [],
        };
      }
      if (row.shareholder_id) {
        companiesMap[row.id].shareholders.push({
          firstName: row.first_name,
          lastName: row.last_name,
          nationality: row.nationality,
        });
      }
    });
    const companies = Object.values(companiesMap);
    return res.status(201).json({ success: true, companies });
  } catch (error) {
    console.error("Error in getAllCompanies(): ",error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function addShareholders(req: Request, res: Response) {
  const { shareholders, company_id } = req.body;
  if (!shareholders || !Array.isArray(shareholders) || !company_id) {
    return res.status(400).json({
      success: false,
      message: "Shareholders array and company_id are required.",
    });
  }
  try {
    const company = await pool.query(
      `
        SELECT * FROM company WHERE id = $1
      `,
      [company_id],
    );

    if (company.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No company found in databse." });
    }
    for (const sh of shareholders) {
      await pool.query(
        `INSERT INTO shareholders (first_name, last_name, nationality, company_id)
         VALUES ($1, $2, $3, $4)`,
        [sh.firstName.trim(), sh.lastName.trim(), sh.nationality, company_id],
      );
    }

    await pool.query(
      `
        UPDATE company SET status = 'saved' WHERE id = $1
      `,
      [company_id],
    );
    return res.status(201).json({
      success: true,
      message: "Shareholders registered successfully!",
    });
  } catch (error) {
    console.error("Error in registerCompany():", error);
    return res.status(500).json({ success: false, error: "Database error" });
  }
}
