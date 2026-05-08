import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/usuarios.css";

import {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../services/api";

function Usuarios({ filtroRol, setFiltroRol }) {

  const [usuarios, setUsuarios] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [creandoUsuario, setCreandoUsuario] = useState(false);

  const [verPasswordCrear, setVerPasswordCrear] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    email: "",
    password: "",
    confirmarPassword: "",
    rol: "trabajador"
  });

  // =========================
  // CARGAR USUARIOS
  // =========================
  const cargarDatos = async () => {
    try {
      const res = await getUsuarios();
      setUsuarios(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================
  // CREAR USUARIO
  // =========================
  const guardarUsuario = async () => {
    if (nuevoUsuario.password !== nuevoUsuario.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    await crearUsuario({
      username: nuevoUsuario.username,
      email: nuevoUsuario.email,
      password: nuevoUsuario.password,
      rol: nuevoUsuario.rol
    });

    await cargarDatos();

    setNuevoUsuario({
      username: "",
      email: "",
      password: "",
      confirmarPassword: "",
      rol: "trabajador"
    });

    setCreandoUsuario(false);
  };

  // =========================
  // EDITAR USUARIO
  // =========================
  const guardarEdicionUsuario = async () => {

    if (
      editandoUsuario.password &&
      editandoUsuario.password !== editandoUsuario.confirmarPassword
    ) {
      alert("Las contraseñas no coinciden");
      return;
    }

    await actualizarUsuario(editandoUsuario.id, {
      username: editandoUsuario.username,
      email: editandoUsuario.email,
      rol: editandoUsuario.rol,

      ...(editandoUsuario.password && {
        password: editandoUsuario.password
      })
    });

    await cargarDatos();
    setEditandoUsuario(null);
  };

  // =========================
  // ELIMINAR
  // =========================
  const handleEliminarUsuario = async (id) => {
    await eliminarUsuario(id);
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  // =========================
  // FILTRO
  // =========================
  const usuariosFiltrados =
    filtroRol === "todos"
      ? usuarios
      : usuarios.filter(u => u.rol === filtroRol);

  return (
    <div className="productos-container">

      <Navbar />

      <h2 className="titulo-seccion">👥 Gestión de Usuarios</h2>

      {/* FILTROS */}
      <div className="filtros-usuarios">
        <button onClick={() => setFiltroRol("todos")}>Todos</button>
        <button onClick={() => setFiltroRol("superadmin")}>Superadmin</button>
        <button onClick={() => setFiltroRol("admin")}>Admin</button>
        <button onClick={() => setFiltroRol("trabajador")}>Trabajador</button>
        <button onClick={() => setFiltroRol("atencion")}>Atención</button>
      </div>

      <button className="btn-agregar" onClick={() => setCreandoUsuario(true)}>
        ➕ Agregar Usuario
      </button>

      {/* ================= GRID ================= */}
      <div className="productos-grid">

        {usuariosFiltrados.map(u => (
          <div key={u.id} className="producto-card">

            <div className="producto-header">
              <h3>👤 {u.username}</h3>
              <span className="precio">{u.rol}</span>
            </div>

            <div className="producto-info">
              <p>📧 {u.email}</p>
            </div>

            <div className="acciones">

              <button
                className="btn-editar"
                onClick={() =>
                  setEditandoUsuario({
                    ...u,
                    password: "",
                    confirmarPassword: "",
                    verPassword: false,
                    token: ""
                  })
                }
              >
                ✏️ Editar
              </button>

              <button
                className="btn-eliminar"
                onClick={() => handleEliminarUsuario(u.id)}
              >
                ❌ Eliminar
              </button>

            </div>

          </div>
        ))}
      </div>

      {/* ================= MODAL CREAR ================= */}
      {creandoUsuario && (
        <div className="modal">
          <div className="modal-content">

            <h2>➕ Crear Usuario</h2>

            <input
              placeholder="Username"
              value={nuevoUsuario.username}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={nuevoUsuario.email}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
              }
            />

            <input
              type={verPasswordCrear ? "text" : "password"}
              placeholder="Contraseña"
              value={nuevoUsuario.password}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
              }
            />

            <input
              type={verPasswordCrear ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={nuevoUsuario.confirmarPassword}
              onChange={(e) =>
                setNuevoUsuario({
                  ...nuevoUsuario,
                  confirmarPassword: e.target.value
                })
              }
            />

            <button onClick={() => setVerPasswordCrear(!verPasswordCrear)}>
              {verPasswordCrear ? "🙈 Ocultar" : "👁️ Ver"}
            </button>

            <select
              value={nuevoUsuario.rol}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
              }
            >
              <option value="superadmin">superadmin</option>
              <option value="admin">admin</option>
              <option value="trabajador">trabajador</option>
              <option value="atencion">atencion</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setCreandoUsuario(false)}>Cancelar</button>
              <button onClick={guardarUsuario}>Guardar</button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL EDITAR ================= */}
      {editandoUsuario && (
        <div className="modal">
          <div className="modal-content">

            <h2>✏️ Editar Usuario</h2>

            <input
              value={editandoUsuario.username}
              onChange={(e) =>
                setEditandoUsuario({ ...editandoUsuario, username: e.target.value })
              }
            />

            <input
              value={editandoUsuario.email}
              onChange={(e) =>
                setEditandoUsuario({ ...editandoUsuario, email: e.target.value })
              }
            />

            <select
              value={editandoUsuario.rol}
              onChange={(e) =>
                setEditandoUsuario({ ...editandoUsuario, rol: e.target.value })
              }
            >
              <option value="superadmin">superadmin</option>
              <option value="admin">admin</option>
              <option value="trabajador">trabajador</option>
              <option value="atencion">atencion</option>
            </select>

            {/* PASSWORD */}
            <div className="password-section">

              <h3>🔐 Cambiar contraseña</h3>

              <input
                type={editandoUsuario.verPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={editandoUsuario.password}
                onChange={(e) =>
                  setEditandoUsuario({ ...editandoUsuario, password: e.target.value })
                }
              />

              <input
                type={editandoUsuario.verPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={editandoUsuario.confirmarPassword}
                onChange={(e) =>
                  setEditandoUsuario({
                    ...editandoUsuario,
                    confirmarPassword: e.target.value
                  })
                }
              />

              <button
                onClick={() =>
                  setEditandoUsuario({
                    ...editandoUsuario,
                    verPassword: !editandoUsuario.verPassword
                  })
                }
              >
                {editandoUsuario.verPassword ? "🙈 Ocultar" : "👁️ Ver"}
              </button>

              {/* TOKEN */}
              <input
                placeholder="Código de verificación (opcional)"
                value={editandoUsuario.token}
                onChange={(e) =>
                  setEditandoUsuario({
                    ...editandoUsuario,
                    token: e.target.value
                  })
                }
              />

            </div>

            <div className="modal-actions">
              <button onClick={() => setEditandoUsuario(null)}>Cancelar</button>
              <button onClick={guardarEdicionUsuario}>Guardar</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Usuarios;