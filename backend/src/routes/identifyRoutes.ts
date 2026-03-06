import { Router } from "express";
import { identifyContact } from "../controllers/identifyController";
import { getDashboardStats } from "../controllers/dashboardController";
import { getAllContacts, searchContacts } from "../controllers/contactController";

const router = Router();

router.post("/identify", identifyContact);
router.get("/dashboard/stats", getDashboardStats);
router.get("/contacts", getAllContacts);
router.get("/contacts/search", searchContacts);

export default router;
