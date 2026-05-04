import express from "express";
import {
  getBajoStock,
  getPorVencer,
  getCriticos
} from "../controllers/alertasController.js";

const router = express.Router();

// ⚠️ ALERTAS
router.get("/bajo-stock", getBajoStock);
router.get("/por-vencer", getPorVencer);
router.get("/criticos", getCriticos);

export default router;