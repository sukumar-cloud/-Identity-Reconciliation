import { Request, Response } from "express";
import { contactRepository } from "../repositories/contactRepository";
import { logger } from "../utils/logger";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const client = await (await import("../db/pool")).default.connect();
    try {
      const totalContacts = await client.query('SELECT COUNT(*) FROM "Contact" WHERE "deletedAt" IS NULL');
      const linkedClusters = await client.query('SELECT COUNT(*) FROM "Contact" WHERE "linkPrecedence" = \'primary\' AND "deletedAt" IS NULL');
      const recentActivity = await client.query(
        'SELECT email, "phoneNumber", "linkPrecedence", "createdAt" FROM "Contact" WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC LIMIT 5'
      );

      res.status(200).json({
        totalContacts: parseInt(totalContacts.rows[0].count),
        linkedClusters: parseInt(linkedClusters.rows[0].count),
        recentActivity: recentActivity.rows.map(row => ({
          email: row.email,
          phone: row.phoneNumber,
          action: row.linkPrecedence === 'primary' ? 'NEW PRIMARY' : 'SECONDARY CREATED',
          createdAt: row.createdAt
        }))
      });
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error("Error fetching dashboard stats", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
