import { PoolClient } from "pg";
import pool from "../db/pool";
import { Contact, IdentifyRequest, IdentifyResponse } from "../models/contact";

// ─── DB helpers ──────────────────────────────────────────────────────────────

async function findContactsByEmailOrPhone(
  client: PoolClient,
  email: string | null | undefined,
  phoneNumber: string | null | undefined
): Promise<Contact[]> {
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
}

async function findAllInCluster(
  client: PoolClient,
  primaryId: number
): Promise<Contact[]> {
  const result = await client.query<Contact>(
    `SELECT * FROM "Contact"
     WHERE (id = $1 OR "linkedId" = $1)
       AND "deletedAt" IS NULL
     ORDER BY "createdAt" ASC`,
    [primaryId]
  );
  return result.rows;
}

async function createContact(
  client: PoolClient,
  email: string | null | undefined,
  phoneNumber: string | null | undefined,
  linkedId: number | null,
  linkPrecedence: "primary" | "secondary"
): Promise<Contact> {
  const result = await client.query<Contact>(
    `INSERT INTO "Contact" (email, "phoneNumber", "linkedId", "linkPrecedence", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [email ?? null, phoneNumber ?? null, linkedId, linkPrecedence]
  );
  return result.rows[0];
}

async function demoteToPrimary(
  client: PoolClient,
  oldPrimaryId: number,
  newPrimaryId: number
): Promise<void> {
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
}

// ─── Primary service function ─────────────────────────────────────────────────

export async function identifyContact(
  req: IdentifyRequest
): Promise<IdentifyResponse> {
  const { email, phoneNumber } = req;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Find all directly matching contacts
    const directMatches = await findContactsByEmailOrPhone(
      client,
      email,
      phoneNumber
    );

    // 2. No matches at all — brand new customer
    if (directMatches.length === 0) {
      const newContact = await createContact(
        client,
        email,
        phoneNumber,
        null,
        "primary"
      );
      await client.query("COMMIT");
      return buildResponse([newContact]);
    }

    // 3. Resolve primary IDs for all matched contacts
    const primaryIds = new Set<number>();
    for (const contact of directMatches) {
      if (contact.linkPrecedence === "primary") {
        primaryIds.add(contact.id);
      } else {
        primaryIds.add(contact.linkedId!);
      }
    }

    // 4. If two different clusters got matched, merge them
    //    The older primary wins; the newer one becomes secondary
    let winnerPrimaryId: number;

    if (primaryIds.size > 1) {
      // Fetch all primaries to compare createdAt
      const primariesResult = await client.query<Contact>(
        `SELECT * FROM "Contact" WHERE id = ANY($1) AND "deletedAt" IS NULL`,
        [Array.from(primaryIds)]
      );
      const primaries = primariesResult.rows.sort(
        (a: Contact, b: Contact) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      winnerPrimaryId = primaries[0].id;

      // Demote all newer primaries
      for (let i = 1; i < primaries.length; i++) {
        await demoteToPrimary(client, primaries[i].id, winnerPrimaryId);
      }
    } else {
      winnerPrimaryId = Array.from(primaryIds)[0];
    }

    // 5. Fetch the full cluster under the winner primary
    const cluster = await findAllInCluster(client, winnerPrimaryId);

    // 6. Check if the incoming info is genuinely new (not already in the cluster)
    const existingEmails = new Set(cluster.map((c) => c.email).filter(Boolean));
    const existingPhones = new Set(
      cluster.map((c) => c.phoneNumber).filter(Boolean)
    );

    const isNewEmail = email && !existingEmails.has(email);
    const isNewPhone = phoneNumber && !existingPhones.has(phoneNumber);

    if (isNewEmail || isNewPhone) {
      const secondary = await createContact(
        client,
        email,
        phoneNumber,
        winnerPrimaryId,
        "secondary"
      );
      cluster.push(secondary);
    }

    await client.query("COMMIT");
    return buildResponse(cluster);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ─── Response builder ─────────────────────────────────────────────────────────

function buildResponse(cluster: Contact[]): IdentifyResponse {
  const primary = cluster.find((c) => c.linkPrecedence === "primary")!;
  const secondaries = cluster.filter((c) => c.linkPrecedence === "secondary");

  // Primary's email/phone come first, then the rest (deduplicated)
  const emails: string[] = [];
  const phones: string[] = [];

  if (primary.email) emails.push(primary.email);
  if (primary.phoneNumber) phones.push(primary.phoneNumber);

  for (const c of secondaries) {
    if (c.email && !emails.includes(c.email)) emails.push(c.email);
    if (c.phoneNumber && !phones.includes(c.phoneNumber)) phones.push(c.phoneNumber);
  }

  return {
    contact: {
      primaryContatctId: primary.id,
      emails,
      phoneNumbers: phones,
      secondaryContactIds: secondaries.map((c) => c.id),
    },
  };
}
