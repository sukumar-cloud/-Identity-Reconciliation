import { Request, Response } from "express";
import { logger } from "../utils/logger";

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const client = await (await import("../db/pool")).default.connect();
    try {
      const result = await client.query(
        'SELECT * FROM "Contact" WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC'
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error("Error fetching all contacts", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchContacts = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const client = await (await import("../db/pool")).default.connect();
    try {
      const queryText = `
        SELECT * FROM "Contact" 
        WHERE "deletedAt" IS NULL 
        AND (email ILIKE $1 OR "phoneNumber" ILIKE $1)
        ORDER BY "createdAt" DESC
      `;
      const result = await client.query(queryText, [`%${q}%`]);
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error("Error searching contacts", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
