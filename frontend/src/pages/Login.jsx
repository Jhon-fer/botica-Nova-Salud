import { useState } from "react";
import { login } from "../services/api";
import "../assets/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login({
        user: email,
        password: password
      });

      console.log("RESPUESTA LOGIN:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.user.rol);

        setMensaje("✅ Login exitoso");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMensaje("❌ " + (data.message || "Credenciales incorrectas"));
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error en el servidor");
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-box"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2>Botica Nova Salud 💊</h2>
        <p className="subtitle">Sistema de gestión</p>

        <input
          type="text"
          placeholder="Email o usuario"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Ocultar contraseña" : "Ver contraseña"}
        </button>

        <button type="submit">Ingresar</button>

        {/* MENSAJE BONITO */}
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
    </div>
  );
}

export default Login;