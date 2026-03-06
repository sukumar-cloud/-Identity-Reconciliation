import { contactRepository } from "../repositories/contactRepository";
import { Contact, IdentifyRequest, IdentifyResponse } from "../models/contact";
import { buildResponse } from "../utils/responseBuilder";
import { logger } from "../utils/logger";

class IdentityService {
  async identify(email?: string | null, phoneNumber?: string | null): Promise<IdentifyResponse> {
    logger.info("Starting identity identification", { email, phoneNumber });

    // 1. Find all directly matching contacts
    const directMatches = await contactRepository.findContactsByEmailOrPhone(
      email || null,
      phoneNumber || null
    );

    // 2. No matches at all — brand new customer
    if (directMatches.length === 0) {
      logger.info("No existing contacts found, creating new primary contact");
      const newContact = await contactRepository.createContact(
        email || null,
        phoneNumber || null,
        null,
        "primary"
      );
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
    let winnerPrimaryId: number;

    if (primaryIds.size > 1) {
      logger.info("Multiple primary clusters found, merging", { primaryIds: Array.from(primaryIds) });
      
      // Fetch all primaries to compare createdAt
      const primaries = await contactRepository.findContactsByIds(Array.from(primaryIds));
      const sortedPrimaries = primaries.sort(
        (a: Contact, b: Contact) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      winnerPrimaryId = sortedPrimaries[0].id;

      // Demote all newer primaries
      for (let i = 1; i < sortedPrimaries.length; i++) {
        await contactRepository.demoteToPrimary(sortedPrimaries[i].id, winnerPrimaryId);
      }
      
      logger.info("Merged clusters", { winnerPrimaryId, demotedPrimaries: sortedPrimaries.slice(1).map(p => p.id) });
    } else {
      winnerPrimaryId = Array.from(primaryIds)[0];
    }

    // 5. Fetch the full cluster under the winner primary
    const cluster = await contactRepository.findAllInCluster(winnerPrimaryId);

    // 6. Check if the incoming info is genuinely new (not already in the cluster)
    const existingEmails = new Set(cluster.map((c) => c.email).filter(Boolean));
    const existingPhones = new Set(
      cluster.map((c) => c.phoneNumber).filter(Boolean)
    );

    const isNewEmail = email && !existingEmails.has(email);
    const isNewPhone = phoneNumber && !existingPhones.has(phoneNumber);

    if (isNewEmail || isNewPhone) {
      logger.info("Creating new secondary contact", { isNewEmail, isNewPhone });
      const secondary = await contactRepository.createContact(
        email || null,
        phoneNumber || null,
        winnerPrimaryId,
        "secondary"
      );
      cluster.push(secondary);
    }

    const result = buildResponse(cluster);
    logger.info("Identity identification completed", { 
      primaryContactId: result.contact.primaryContatctId,
      emailsCount: result.contact.emails.length,
      phoneNumbersCount: result.contact.phoneNumbers.length,
      secondaryContactsCount: result.contact.secondaryContactIds.length
    });

    return result;
  }
}

export const identifyService = new IdentityService();
