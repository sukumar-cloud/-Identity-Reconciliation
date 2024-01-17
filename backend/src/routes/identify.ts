import { Router, Request, Response } from "express";
import { identifyContact } from "../services/identityService";
import { IdentifyRequest } from "../models/contact";

const router = Router();

router.post("/identify", async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber }: IdentifyRequest = req.body;

    // Validate: at least one of email or phoneNumber must be provided
    const hasEmail = email !== null && email !== undefined && email !== "";
    const hasPhone =
      phoneNumber !== null &&
      phoneNumber !== undefined &&
      String(phoneNumber) !== "";

    if (!hasEmail && !hasPhone) {
      res.status(400).json({
        error: "At least one of email or phoneNumber must be provided.",
      });
      return;
    }

    const result = await identifyContact({
      email: hasEmail ? String(email).trim() : null,
      phoneNumber: hasPhone ? String(phoneNumber).trim() : null,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /identify:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
