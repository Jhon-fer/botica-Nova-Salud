import { useEffect, useState } from "react";
import { getProductos, eliminarProducto, crearVenta } from "../services/api";

function Home() {
  const [productos, setProductos] = useState([]);
  const rol = localStorage.getItem("rol");

  useEffect(() => {
    getProductos()
      .then(data => {
        console.log("PRODUCTOS:", data);
        setProductos(data.data || data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleEliminar = async (id) => {
    await eliminarProducto(id);
    window.location.reload();
  };

  return (
    <div>
      <h1>Productos 💊</h1>

      <p>Rol: {rol}</p>

      <button onClick={handleLogout}>Cerrar sesión</button>

      {/* ➕ SOLO ADMIN Y SUPERADMIN */}
      {(rol === "admin" || rol === "superadmin") && (
        <button>➕ Agregar producto</button>
      )}

      {Array.isArray(productos) ? (
        productos.map((p) => (
          <div key={p.id}>
            <p>{p.nombre}</p>

            {/* ✏️ EDITAR */}
            {(rol === "admin" || rol === "trabajador" || rol === "superadmin") && (
              <button>✏️ Editar</button>
            )}

            {/* ❌ ELIMINAR */}
            {(rol === "admin" || rol === "trabajador" || rol === "superadmin") && (
              <button onClick={() => handleEliminar(p.id)}>
                ❌ Eliminar
              </button>
            )}

            {/* 💰 VENDER */}
            {(rol === "atencion" || rol === "superadmin") && (
              <button onClick={() => crearVenta({ producto_id: p.id })}>
                💰 Vender
              </button>
            )}
          </div>
        ))
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default Home;