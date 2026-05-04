import express from "express";
import cors from "cors";

import productosRoutes from "./routes/productosRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";
import alertasRoutes from "./routes/alertasRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS
app.use("/productos", productosRoutes);
app.use("/ventas", ventasRoutes);
app.use("/api/alertas", alertasRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});