import { pool } from "../config/db.js";

/* =========================
   🔍 LISTAR PRODUCTOS
========================= */
export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Productos");

    const data = rows.map(p => ({
      ...p,
      vencimiento: p.vencimiento
        ? new Date(p.vencimiento).toLocaleDateString("es-PE")
        : null,
      created_at: p.created_at
        ? new Date(p.created_at).toLocaleString("es-PE")
        : null
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   🔍 OBTENER POR ID
========================= */
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM Productos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const producto = rows[0];

    res.json({
      ...producto,
      vencimiento: producto.vencimiento
        ? new Date(producto.vencimiento).toLocaleDateString("es-PE")
        : null,
      created_at: producto.created_at
        ? new Date(producto.created_at).toLocaleString("es-PE")
        : null
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ➕ CREAR PRODUCTO
========================= */
export const createProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, vencimiento } = req.body;

    await pool.query(
      "INSERT INTO Productos (nombre, precio, stock, vencimiento, created_at) VALUES (?,?,?,?, NOW())",
      [nombre, precio, stock, vencimiento]
    );

    res.json({ message: "Producto creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ✏️ ACTUALIZAR PRODUCTO
========================= */
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, stock, vencimiento } = req.body;

    await pool.query(
      "UPDATE Productos SET nombre=?, precio=?, stock=?, vencimiento=? WHERE id=?",
      [nombre, precio, stock, vencimiento, id]
    );

    res.json({ message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ❌ ELIMINAR PRODUCTO
========================= */
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM Productos WHERE id=?", [id]);

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   🔎 BÚSQUEDA (ATENCIÓN AL CLIENTE)
========================= */
export const buscarProductos = async (req, res) => {
  try {
    const { nombre } = req.query;

    const [rows] = await pool.query(
      "SELECT * FROM Productos WHERE nombre LIKE ?",
      [`%${nombre}%`]
    );

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