import express from "express";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from "../controllers/productosController.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/authRoles.js";

const router = express.Router();

// 📦 VER PRODUCTOS (TODOS LOS ROLES)
router.get(
  "/",
  verificarToken,
  verificarRol("superadmin", "admin", "trabajador", "atencion"),
  getProductos
);

// ➕ CREAR PRODUCTO (ADMIN / SUPERADMIN)
router.post(
  "/",
  verificarToken,
  verificarRol("superadmin", "admin"),
  createProducto
);

// ✏️ EDITAR PRODUCTO (ADMIN / TRABAJADOR)
router.put(
  "/:id",
  verificarToken,
  verificarRol("superadmin", "admin", "trabajador"),
  updateProducto
);

// ❌ ELIMINAR PRODUCTO (ADMIN / TRABAJADOR)
router.delete(
  "/:id",
  verificarToken,
  verificarRol("superadmin", "admin", "trabajador"),
  deleteProducto
);

export default router;