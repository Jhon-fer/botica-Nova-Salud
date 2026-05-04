import { useEffect, useState } from "react";
import {
  getProductos,
  eliminarProducto,
  actualizarProducto
} from "../services/api";
import Navbar from "../components/Navbar";
import "../assets/productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const rol = localStorage.getItem("rol");

  const cargarProductos = () => {
    getProductos()
      .then(data => setProductos(data.data || data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEliminar = async (id) => {
    try {
      await eliminarProducto(id);
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const abrirEditor = (producto) => {
    setEditando({ ...producto });
  };

  const guardarEdicion = async () => {
    try {
      const data = {
        nombre: editando.nombre,
        precio: Number(editando.precio),
        stock: Number(editando.stock),
        vencimiento: editando.vencimiento
          ? editando.vencimiento.includes("/")
            ? editando.vencimiento.split("/").reverse().join("-")
            : editando.vencimiento
          : null
      };

      await actualizarProducto(editando.id, data);

      alert("✅ Producto actualizado correctamente");

      setEditando(null);
      cargarProductos();

    } catch (error) {
      console.error("❌ ERROR UPDATE:", error);
      alert("Error al actualizar producto");
    }
  };

  return (
    <div className="productos-container">
      <Navbar />

      <h1>📦 Gestión de Productos</h1>

      <div className="productos-grid">
        {productos.map((p) => (
          <div key={p.id} className="producto-card">

            <h3>{p.nombre}</h3>

            {/* 💰 SOLES PERUANOS */}
            <p>💰 S/ {Number(p.precio).toFixed(2)}</p>

            <p>📦 Stock: {p.stock}</p>
            <p>📅 Vencimiento: {p.vencimiento}</p>

            {(rol === "trabajador" || rol === "admin" || rol === "superadmin") && (
              <div className="acciones">
                <button onClick={() => abrirEditor(p)}>
                  ✏️ Editar
                </button>

                <button onClick={() => handleEliminar(p.id)}>
                  ❌ Eliminar
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* MODAL */}
      {editando && (
        <div className="modal">
          <div className="modal-content">

            <h2>Editar producto</h2>

            <input
              value={editando.nombre || ""}
              onChange={(e) =>
                setEditando({ ...editando, nombre: e.target.value })
              }
              placeholder="Nombre"
            />

            {/* 💰 INPUT CON SOLES */}
            <input
              type="number"
              value={editando.precio || ""}
              onChange={(e) =>
                setEditando({ ...editando, precio: e.target.value })
              }
              placeholder="Precio (S/)"
            />

            <input
              type="number"
              value={editando.stock || ""}
              onChange={(e) =>
                setEditando({ ...editando, stock: e.target.value })
              }
              placeholder="Stock"
            />

            <input
              value={editando.vencimiento || ""}
              onChange={(e) =>
                setEditando({ ...editando, vencimiento: e.target.value })
              }
              placeholder="YYYY-MM-DD o DD/MM/YYYY"
            />

            <div className="modal-actions">
              <button onClick={() => setEditando(null)}>
                Cancelar
              </button>

              <button onClick={guardarEdicion}>
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;