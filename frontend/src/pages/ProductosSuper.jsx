import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/productoSuper.css";

import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../services/api";

function ProductosSuper() {
  const [productos, setProductos] = useState([]);
  const [creandoProducto, setCreandoProducto] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    vencimiento: ""
  });

  // =========================
  // FORMATEAR FECHA BONITA
  // =========================
  const formatearFechaBonita = (fecha) => {
    if (!fecha) return "Sin fecha";

    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    let d, m, y;

    if (fecha.includes("-")) {
      [y, m, d] = fecha.split("-");
    } else if (fecha.includes("/")) {
      [d, m, y] = fecha.split("/");
    } else {
      return fecha;
    }

    return `${String(d).padStart(2, "0")} de ${meses[Number(m) - 1]} del ${y}`;
  };

  // =========================
  // CARGAR PRODUCTOS
  // =========================
  const cargarDatos = async () => {
    try {
      const res = await getProductos();
      setProductos(res?.data?.productos || res?.data || res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================
  // CREAR
  // =========================
  const guardarProducto = async () => {
    await crearProducto({
      ...nuevoProducto,
      precio: Number(nuevoProducto.precio),
      stock: Number(nuevoProducto.stock)
    });

    await cargarDatos();

    setNuevoProducto({
      nombre: "",
      precio: "",
      stock: "",
      vencimiento: ""
    });

    setCreandoProducto(false);
  };

  // =========================
  // EDITAR
  // =========================
  const guardarEdicion = async () => {
    await actualizarProducto(editandoProducto.id, {
      ...editandoProducto,
      precio: Number(editandoProducto.precio),
      stock: Number(editandoProducto.stock)
    });

    await cargarDatos();
    setEditandoProducto(null);
  };

  // =========================
  // ELIMINAR
  // =========================
  const handleEliminar = async (id) => {
    await eliminarProducto(id);
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="productos-container">
      <Navbar />

      <h2 className="titulo-seccion">💊 Productos Superadmin</h2>

      <button
      className="btn-agregar"
      onClick={() => setCreandoProducto(true)}
      >
      ➕ Agregar Producto
      </button>

      {/* ================= GRID ================= */}
      <div className="productos-grid">
        {productos.map(p => (
          <div key={p.id} className="producto-card">

            <div className="producto-header">
              <h3>💊 {p.nombre}</h3>
              <span className="precio">S/ {Number(p.precio).toFixed(2)}</span>
            </div>

            <div className="producto-info">
              <p>📦 <b>Stock:</b> {p.stock}</p>
              <p>📅 <b>Vence:</b> {formatearFechaBonita(p.vencimiento)}</p>
            </div>

            <div className="acciones">
              <button className="btn-editar" onClick={() => setEditandoProducto(p)}>
                ✏️ Editar
              </button>

              <button className="btn-eliminar" onClick={() => handleEliminar(p.id)}>
                ❌ Eliminar
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ================= CREAR ================= */}
      {creandoProducto && (
        <div className="modal">
          <div className="modal-content">
            <h2>➕ Crear Producto</h2>

            <input
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={e =>
                setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={e =>
                setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Stock"
              value={nuevoProducto.stock}
              onChange={e =>
                setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
              }
            />

            <input
              type="date"
              value={nuevoProducto.vencimiento}
              onChange={e =>
                setNuevoProducto({ ...nuevoProducto, vencimiento: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setCreandoProducto(false)}>Cancelar</button>
              <button onClick={guardarProducto}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDITAR ================= */}
      {editandoProducto && (
        <div className="modal">
          <div className="modal-content">
            <h2>✏️ Editar Producto</h2>

            <input
              value={editandoProducto.nombre}
              onChange={e =>
                setEditandoProducto({ ...editandoProducto, nombre: e.target.value })
              }
            />

            <input
              type="number"
              value={editandoProducto.precio}
              onChange={e =>
                setEditandoProducto({ ...editandoProducto, precio: e.target.value })
              }
            />

            <input
              type="number"
              value={editandoProducto.stock}
              onChange={e =>
                setEditandoProducto({ ...editandoProducto, stock: e.target.value })
              }
            />

            <input
              type="date"
              value={editandoProducto.vencimiento}
              onChange={e =>
                setEditandoProducto({ ...editandoProducto, vencimiento: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setEditandoProducto(null)}>Cancelar</button>
              <button onClick={guardarEdicion}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosSuper;