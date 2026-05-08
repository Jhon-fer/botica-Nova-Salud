import { useEffect, useState } from "react";
import {
  getProductos,
  eliminarProducto,
  actualizarProducto,
  crearProducto
} from "../services/api";

import Navbar from "../components/Navbar";
import "../assets/dashboard.css";

function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    vencimiento: ""
  });

  const rol = localStorage.getItem("rol");

  // =========================
  // CARGAR
  // =========================
  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data.data || data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // =========================
  // ELIMINAR
  // =========================
  const handleEliminar = async (id) => {
    try {
      await eliminarProducto(id);
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // FORMATO FECHA
  // =========================
  const formatearFecha = (fecha) => {
    if (!fecha) return null;

    if (fecha.includes("-")) return fecha;

    if (fecha.includes("/")) {
      const [d, m, y] = fecha.split("/");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    return fecha;
  };

  // =========================
  // EDITAR
  // =========================
  const abrirEditor = (producto) => {
    setEditando({
      ...producto,
      nombre: producto.nombre || "",
      precio: producto.precio || "",
      stock: producto.stock || "",
      vencimiento: producto.vencimiento || ""
    });
  };

  const guardarEdicion = async () => {
    try {
      const data = {
        nombre: editando.nombre.trim(),
        precio: Number(editando.precio) || 0,
        stock: Number(editando.stock) || 0,
        vencimiento: formatearFecha(editando.vencimiento)
      };

      await actualizarProducto(editando.id, data);

      // 🔥 UI INSTANTÁNEA (NO F5)
      setProductos(prev =>
        prev.map(p =>
          p.id === editando.id ? { ...p, ...data } : p
        )
      );

      setEditando(null);

    } catch (error) {
      console.error("ERROR UPDATE:", error);
      alert("Error al actualizar producto");
    }
  };

  // =========================
  // CREAR
  // =========================
  const guardarProducto = async () => {
    try {
      const data = {
        nombre: nuevoProducto.nombre,
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock),
        vencimiento: formatearFecha(nuevoProducto.vencimiento)
      };

      const nuevo = await crearProducto(data);

      setProductos(prev => [
        ...prev,
        { ...data, id: nuevo?.id || Date.now() }
      ]);

      setCreando(false);
      setNuevoProducto({
        nombre: "",
        precio: "",
        stock: "",
        vencimiento: ""
      });

    } catch (error) {
      console.error("ERROR CREATE:", error);
      alert("Error al crear producto");
    }
  };

  return (
    <div className="productos-container">
      <Navbar />

      <h1>📦 Dashboard de Productos</h1>

      <button className="btn-agregar" onClick={() => setCreando(true)}>
        ➕ Agregar Producto
      </button>

      {/* LISTA */}
      <div className="productos-grid">
        {productos.map((p) => (
          <div key={p.id} className="producto-card">

            <h3>{p.nombre}</h3>

            <p>💰 S/ {Number(p.precio).toFixed(2)}</p>
            <p>📦 Stock: {p.stock}</p>
            <p>📅 Vencimiento: {p.vencimiento}</p>

            {(rol === "admin" || rol === "superadmin" || rol === "trabajador") && (
              <div className="acciones">
                <button onClick={() => abrirEditor(p)}>✏️ Editar</button>
                <button onClick={() => handleEliminar(p.id)}>❌ Eliminar</button>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* MODAL EDITAR */}
      {editando && (
        <div className="modal">
          <div className="modal-content">

            <h2>✏️ Editar Producto</h2>

            <input
              value={editando.nombre}
              onChange={(e) =>
                setEditando({ ...editando, nombre: e.target.value })
              }
            />

            <input
              type="number"
              value={editando.precio}
              onChange={(e) =>
                setEditando({ ...editando, precio: e.target.value })
              }
            />

            <input
              type="number"
              value={editando.stock}
              onChange={(e) =>
                setEditando({ ...editando, stock: e.target.value })
              }
            />

            <input
              value={editando.vencimiento}
              onChange={(e) =>
                setEditando({ ...editando, vencimiento: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setEditando(null)}>Cancelar</button>
              <button onClick={guardarEdicion}>Guardar</button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL CREAR */}
      {creando && (
        <div className="modal">
          <div className="modal-content">

            <h2>➕ Crear Producto</h2>

            <input
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Stock"
              value={nuevoProducto.stock}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
              }
            />

            <input
              placeholder="YYYY-MM-DD"
              value={nuevoProducto.vencimiento}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, vencimiento: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setCreando(false)}>Cancelar</button>
              <button onClick={guardarProducto}>Guardar</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;