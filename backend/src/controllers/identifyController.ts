import { Request, Response } from "express";
import { identifyService } from "../services/identityService";
import { logger } from "../utils/logger";
import { identifyRequestSchema } from "../utils/validation";

export const identifyContact = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = identifyRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      logger.warn("Invalid request data", { errors: validationResult.error.errors });
      return res.status(400).json({ 
        error: "Invalid input data",
        details: validationResult.error.errors
      });
    }

    const { email, phoneNumber } = validationResult.data;
    
    logger.info("Identity identification request", { email, phoneNumber });
    
    const result = await identifyService.identify(email, phoneNumber);
    
    logger.info("Identity identification successful", { 
      primaryContactId: result.contact.primaryContatctId,
      emailsCount: result.contact.emails.length,
      phoneNumbersCount: result.contact.phoneNumbers.length,
      secondaryContactsCount: result.contact.secondaryContactIds.length
    });
    
    res.status(200).json(result);
  } catch (error: any) {
    logger.error("Error in identify controller", { error: error.message });
    res.status(500).json({ error: "Internal server error" });
  }
};
