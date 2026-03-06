import { Router } from "express";
import { identifyContact } from "../controllers/identifyController";
import { getDashboardStats } from "../controllers/dashboardController";

const router = Router();

router.post("/identify", identifyContact);
router.get("/dashboard/stats", getDashboardStats);

export default router;
