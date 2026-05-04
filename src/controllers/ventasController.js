import { pool } from "../config/db.js";

/* =========================
   💰 CREAR VENTA
========================= */
export const crearVenta = async (req, res) => {
  try {
    const { productos } = req.body;

    let total = 0;

    // 🟢 crear venta con fecha automática
    const [ventaResult] = await pool.query(
      "INSERT INTO Ventas (total, fecha) VALUES (0, NOW())"
    );

    const ventaId = ventaResult.insertId;

    // 🟢 procesar productos
    for (const item of productos) {
      const [rows] = await pool.query(
        "SELECT * FROM Productos WHERE id = ?",
        [item.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: `Producto con ID ${item.id} no encontrado`
        });
      }

      const producto = rows[0];

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para ${producto.nombre}`
        });
      }

      const subtotal = Number(producto.precio) * item.cantidad;
      total += subtotal;

      await pool.query(
        "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, subtotal) VALUES (?,?,?,?)",
        [ventaId, item.id, item.cantidad, subtotal]
      );

      await pool.query(
        "UPDATE Productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, item.id]
      );
    }

    // 🟢 actualizar total final
    await pool.query(
      "UPDATE Ventas SET total = ? WHERE id = ?",
      [total, ventaId]
    );

    res.json({
      message: "Venta registrada correctamente",
      ventaId,
      total
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   📊 LISTAR VENTAS
========================= */
export const getVentas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Ventas ORDER BY id DESC"
    );

    const data = rows.map(v => ({
      ...v,
      fecha: v.fecha
        ? new Date(v.fecha).toLocaleString("es-PE")
        : null
    }));

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   🔍 OBTENER VENTA POR ID
========================= */
export const getVentaById = async (req, res) => {
  try {
    const { id } = req.params;

    const [venta] = await pool.query(
      "SELECT * FROM Ventas WHERE id = ?",
      [id]
    );

    if (venta.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    const [detalle] = await pool.query(
      "SELECT * FROM detalle_ventas WHERE venta_id = ?",
      [id]
    );

    res.json({
      venta: {
        ...venta[0],
        fecha: venta[0].fecha
          ? new Date(venta[0].fecha).toLocaleString("es-PE")
          : null
      },
      detalle
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ✏️ EDITAR VENTA (BÁSICO)
========================= */
export const updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { total } = req.body;

    const [result] = await pool.query(
      "UPDATE Ventas SET total = ? WHERE id = ?",
      [total, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json({ message: "Venta actualizada correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ❌ ELIMINAR VENTA
========================= */
export const deleteVenta = async (req, res) => {
  try {
    const { id } = req.params;

    // borrar detalle primero (clave foránea lógica)
    await pool.query(
      "DELETE FROM detalle_ventas WHERE venta_id = ?",
      [id]
    );

    const [result] = await pool.query(
      "DELETE FROM Ventas WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json({ message: "Venta eliminada correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};