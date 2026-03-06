import { PoolClient } from "pg";
import pool from "../db/pool";
import { Contact } from "../models/contact";

export class ContactRepository {
  async findContactsByEmailOrPhone(
    email: string | null,
    phoneNumber: string | null
  ): Promise<Contact[]> {
    const client = await pool.connect();
    try {
      const conditions: string[] = [];
      const values: (string | null)[] = [];

      if (email) {
        values.push(email);
        conditions.push(`email = $${values.length}`);
      }
      if (phoneNumber) {
        values.push(phoneNumber);
        conditions.push(`"phoneNumber" = $${values.length}`);
      }

      if (conditions.length === 0) return [];

      const result = await client.query<Contact>(
        `SELECT * FROM "Contact"
         WHERE (${conditions.join(" OR ")})
           AND "deletedAt" IS NULL
         ORDER BY "createdAt" ASC`,
        values
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async findContactsByIds(ids: number[]): Promise<Contact[]> {
    const client = await pool.connect();
    try {
      const result = await client.query<Contact>(
        `SELECT * FROM "Contact"
         WHERE id = ANY($1)
           AND "deletedAt" IS NULL
         ORDER BY "createdAt" ASC`,
        [ids]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async findAllInCluster(primaryId: number): Promise<Contact[]> {
    const client = await pool.connect();
    try {
      const result = await client.query<Contact>(
        `SELECT * FROM "Contact"
         WHERE (id = $1 OR "linkedId" = $1)
           AND "deletedAt" IS NULL
         ORDER BY "createdAt" ASC`,
        [primaryId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createContact(
    email: string | null,
    phoneNumber: string | null,
    linkedId: number | null,
    linkPrecedence: "primary" | "secondary"
  ): Promise<Contact> {
    const client = await pool.connect();
    try {
      const result = await client.query<Contact>(
        `INSERT INTO "Contact" (email, "phoneNumber", "linkedId", "linkPrecedence", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [email, phoneNumber, linkedId, linkPrecedence]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateContact(
    id: number,
    updates: {
      linkedId?: number;
      linkPrecedence?: "primary" | "secondary";
    }
  ): Promise<void> {
    const client = await pool.connect();
    try {
      const setClause: string[] = [];
      const values: any[] = [];

      if (updates.linkedId !== undefined) {
        setClause.push(`"linkedId" = $${values.length + 1}`);
        values.push(updates.linkedId);
      }
      if (updates.linkPrecedence !== undefined) {
        setClause.push(`"linkPrecedence" = $${values.length + 1}`);
        values.push(updates.linkPrecedence);
      }

      if (setClause.length === 0) return;

      setClause.push(`"updatedAt" = NOW()`);
      values.push(id);

      await client.query(
        `UPDATE "Contact" SET ${setClause.join(", ")} WHERE id = $${values.length}`,
        values
      );
    } finally {
      client.release();
    }
  }

  async demoteToPrimary(
    oldPrimaryId: number,
    newPrimaryId: number
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Demote the old primary itself
      await client.query(
        `UPDATE "Contact"
         SET "linkedId" = $1, "linkPrecedence" = 'secondary', "updatedAt" = NOW()
         WHERE id = $2`,
        [newPrimaryId, oldPrimaryId]
      );

      // Re-point all secondaries that were under old primary
      await client.query(
        `UPDATE "Contact"
         SET "linkedId" = $1, "updatedAt" = NOW()
         WHERE "linkedId" = $2 AND "deletedAt" IS NULL`,
        [newPrimaryId, oldPrimaryId]
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export const contactRepository = new ContactRepository();
