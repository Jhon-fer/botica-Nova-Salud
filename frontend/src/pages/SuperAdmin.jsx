import { useEffect, useState } from "react";
import ProductosSuper from "./ProductosSuper";
import Usuarios from "./Usuarios";
import "../assets/superAdmin.css";

function SuperAdmin() {

  // 🔥 RECUPERAR TAB GUARDADO
  const [tab, setTab] = useState(
    localStorage.getItem("tabSuperAdmin") || "productos"
  );

  const [filtroRol, setFiltroRol] = useState("todos");

  // 🔥 GUARDAR TAB CUANDO CAMBIA
  useEffect(() => {
    localStorage.setItem("tabSuperAdmin", tab);
  }, [tab]);

  return (
    <div className="superadmin-container">

      {/* ================= HEADER MODERNO ================= */}
      <div className="superadmin-header">

        <div>
          <h1 className="superadmin-title">
            🧠 Centro de Control Nova Salud
          </h1>

          <p className="superadmin-subtitle">
            Administración general del sistema farmacéutico
          </p>
        </div>

      </div>

      {/* ================= TABS ================= */}
      <div className="tabs-superadmin">

        <button
          className={tab === "productos" ? "tab-active" : ""}
          onClick={() => setTab("productos")}
        >
          💊 Productos
        </button>

        <button
          className={tab === "usuarios" ? "tab-active" : ""}
          onClick={() => setTab("usuarios")}
        >
          👥 Usuarios
        </button>

      </div>

      {/* ================= CONTENIDO ================= */}
      {tab === "productos" && <ProductosSuper />}

      {tab === "usuarios" && (
        <Usuarios
          filtroRol={filtroRol}
          setFiltroRol={setFiltroRol}
        />
      )}

    </div>
  );
}

export default SuperAdmin;