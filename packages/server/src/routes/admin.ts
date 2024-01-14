import { Router } from "express";

const adminRoutes = Router();

adminRoutes.post("/update-summaries");
adminRoutes.post("/update-recommendations");
adminRoutes.post("/update-users");

export { adminRoutes };
