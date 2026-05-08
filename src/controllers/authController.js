import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   🔐 LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { user, password } = req.body;

    if (!user || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM Usuarios WHERE email = ? OR username = ?",
      [user.trim(), user.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    const validPassword = await bcrypt.compare(password, usuario.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      "senati",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login correcto",
      token,
      user: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ➕ REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;

    if (!username || !email || !password || !rol) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const rolesValidos = ["superadmin", "admin", "trabajador", "atencion"];

    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const [exists] = await pool.query(
      "SELECT * FROM Usuarios WHERE email = ? OR username = ?",
      [email, username]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO Usuarios (username, email, password, rol) VALUES (?,?,?,?)",
      [username.trim(), email.trim(), hashedPassword, rol]
    );

    res.json({ message: "Usuario creado correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   📋 VER USUARIOS
========================= */
export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, rol FROM Usuarios"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ✏️ EDITAR USUARIO
========================= */
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      username,
      email,
      rol,
      password
    } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM Usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔥 SI VIENE PASSWORD, LA ENCRIPTAMOS
    let passwordHash = null;

    if (password && password.trim() !== "") {
      passwordHash = await bcrypt.hash(password, 10);
    }

    // 🔥 UPDATE DINÁMICO
    if (passwordHash) {
      await pool.query(
        "UPDATE Usuarios SET username=?, email=?, rol=?, password=? WHERE id=?",
        [username, email, rol, passwordHash, id]
      );
    } else {
      await pool.query(
        "UPDATE Usuarios SET username=?, email=?, rol=? WHERE id=?",
        [username, email, rol, id]
      );
    }

    res.json({ message: "Usuario actualizado correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ❌ ELIMINAR USUARIO
========================= */
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM Usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await pool.query("DELETE FROM Usuarios WHERE id=?", [id]);

    res.json({ message: "Usuario eliminado" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};