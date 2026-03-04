import express from "express";
import {
  addShareholders,
  getAllCompanies,
  getDraftCompany,
  registerCompany,
  updateCompany,
} from "../controller/company.controller.js";

const router = express.Router();

router.get("/", getAllCompanies);
router.get("/company/:id", getDraftCompany);
router.post("/register", registerCompany);
router.post("/shareholders", addShareholders);

router.put("/register/update", updateCompany);

export default router;
