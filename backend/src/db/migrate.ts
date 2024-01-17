import pool from "./pool";

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Contact" (
        id              SERIAL PRIMARY KEY,
        "phoneNumber"   VARCHAR(20),
        email           VARCHAR(255),
        "linkedId"      INTEGER REFERENCES "Contact"(id) ON DELETE SET NULL,
        "linkPrecedence" VARCHAR(10) NOT NULL CHECK ("linkPrecedence" IN ('primary', 'secondary')),
        "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deletedAt"     TIMESTAMPTZ
      );

      CREATE INDEX IF NOT EXISTS idx_contact_email        ON "Contact"(email)         WHERE email IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_contact_phone        ON "Contact"("phoneNumber")  WHERE "phoneNumber" IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_contact_linked_id    ON "Contact"("linkedId")     WHERE "linkedId" IS NOT NULL;
    `);
    console.log("✅ Migration complete — Contact table ready.");
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
