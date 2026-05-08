const BASE_URL = "http://localhost:4000";

// 🔐 HEADERS CON TOKEN
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// =========================
// 🔐 LOGIN
// =========================
export const login = async (credenciales) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credenciales),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error login");

  return data;
};

// =========================
// 📦 PRODUCTOS
// =========================
export const getProductos = async () => {
  const res = await fetch(`${BASE_URL}/productos`, {
    headers: getHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error productos");

  return data;
};

export const crearProducto = async (producto) => {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(producto),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error crear producto");

  return data;
};

export const actualizarProducto = async (id, producto) => {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(producto),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error actualizar producto");

  return data;
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error eliminar producto");

  return data;
};

// =========================
// 💰 VENTAS
// =========================
export const crearVenta = async (venta) => {
  const res = await fetch(`${BASE_URL}/ventas`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(venta),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error venta");

  return data;
};

// =========================
// ⚠️ ALERTAS
// =========================
export const getBajoStock = async () => {
  const res = await fetch(`${BASE_URL}/api/alertas/bajo-stock`, {
    headers: getHeaders(),
  });

  return await res.json();
};

export const getPorVencer = async () => {
  const res = await fetch(`${BASE_URL}/api/alertas/por-vencer`, {
    headers: getHeaders(),
  });

  return await res.json();
};

export const getCriticos = async () => {
  const res = await fetch(`${BASE_URL}/api/alertas/criticos`, {
    headers: getHeaders(),
  });

  return await res.json();
};

// =========================
// 👥 USUARIOS
// =========================
export const getUsuarios = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/usuarios`, {
    headers: getHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error usuarios");

  return data;
};

export const crearUsuario = async (usuario) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(usuario),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error crear usuario");

  return data;
};

export const actualizarUsuario = async (id, usuario) => {
  const res = await fetch(`${BASE_URL}/api/auth/usuarios/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(usuario),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error actualizar usuario");

  return data;
};

export const eliminarUsuario = async (id) => {
  const res = await fetch(`${BASE_URL}/api/auth/usuarios/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error eliminar usuario");

  return data;
};