import express from "express";
import { crearVenta } from "../controllers/ventasController.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/authRoles.js";

const router = express.Router();

// 💰 SOLO ATENCIÓN Y SUPERADMIN
router.post(
  "/",
  verificarToken,
  verificarRol("superadmin", "atencion"),
  crearVenta
);

export default router;