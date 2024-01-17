import express from "express";
import dotenv from "dotenv";
import identifyRouter from "./routes/identify";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", message: "Bitespeed Identity Service is running." });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/", identifyRouter);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
