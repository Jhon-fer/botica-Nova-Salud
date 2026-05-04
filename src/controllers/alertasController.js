import { pool } from "../config/db.js";

/* =========================
   ⚠️ PRODUCTOS CON BAJO STOCK
========================= */
export const getBajoStock = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Productos WHERE stock <= 5 ORDER BY stock ASC"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ⏰ PRODUCTOS POR VENCER (30 días)
========================= */
export const getPorVencer = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM Productos
      WHERE vencimiento IS NOT NULL
      AND vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY vencimiento ASC
    `);

    const data = rows.map(p => ({
      ...p,
      vencimiento: p.vencimiento
        ? new Date(p.vencimiento).toLocaleDateString("es-PE")
        : null
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   🚨 PRODUCTOS CRÍTICOS
   (stock bajo + por vencer)
========================= */
export const getCriticos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM Productos
      WHERE stock <= 5
      OR (vencimiento IS NOT NULL AND vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY))
      ORDER BY stock ASC, vencimiento ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};