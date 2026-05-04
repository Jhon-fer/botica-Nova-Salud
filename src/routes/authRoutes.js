import express from "express";
import {
  login,
  register,
  getUsuarios,
  updateUsuario,
  deleteUsuario
} from "../controllers/authController.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/authRoles.js";

const router = express.Router();

/* =========================
   🔐 LOGIN (PUBLICO)
========================= */
router.post("/login", login);

/* =========================
   👑 USUARIOS (PROTEGIDO)
========================= */

/* 📋 VER USUARIOS */
router.get(
  "/usuarios",
  verificarToken,
  verificarRol("superadmin", "admin"),
  getUsuarios
);

/* ➕ CREAR USUARIO */
router.post(
  "/register",
  verificarToken,
  verificarRol("superadmin", "admin"),
  register
);

/* ✏️ EDITAR USUARIO */
router.put(
  "/usuarios/:id",
  verificarToken,
  verificarRol("superadmin", "admin"),
  updateUsuario
);

/* ❌ ELIMINAR USUARIO (solo superadmin) */
router.delete(
  "/usuarios/:id",
  verificarToken,
  verificarRol("superadmin"),
  deleteUsuario
);

export default router;