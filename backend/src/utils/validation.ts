import { z } from "zod";

export const identifyRequestSchema = z.object({
  email: z.string().email().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
}).refine(
  (data) => {
    // At least one of email or phoneNumber must be provided and not null
    const hasEmail = data.email !== null && data.email !== undefined && data.email.trim() !== "";
    const hasPhone = data.phoneNumber !== null && data.phoneNumber !== undefined && data.phoneNumber.trim() !== "";
    return hasEmail || hasPhone;
  },
  {
    message: "At least one of email or phoneNumber must be provided",
    path: ["root"],
  }
);

export type IdentifyRequestInput = z.infer<typeof identifyRequestSchema>;
