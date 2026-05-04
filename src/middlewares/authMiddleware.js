import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔥 validar null, undefined o vacío
  if (!authHeader || authHeader === "undefined") {
    return res.status(403).json({ message: "Token requerido" });
  }

  try {
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(403).json({ message: "Token mal formado" });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, "senati");

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};