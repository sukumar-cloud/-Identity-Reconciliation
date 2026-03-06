import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const requiresSsl =
  typeof connectionString === "string" &&
  /(^|[?&])sslmode=require($|&)/i.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production" || requiresSsl
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
