import { Contact, IdentifyResponse } from "../models/contact";

export function buildResponse(cluster: Contact[]): IdentifyResponse {
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
