import Login from "./pages/Login";
import Home from "./pages/Home";
import Ventas from "./pages/Ventas";
import Productos from "./pages/Productos";
import Dashboard from "./pages/Dashboard";
import SuperAdmin from "./pages/SuperAdmin"; // 👈 correcto

function App() {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // 🔐 SIN LOGIN
  if (!token) return <Login />;

  // 🎯 SEGÚN ROL
  switch (rol) {
    case "atencion":
      return <Ventas />;

    case "trabajador":
      return <Productos />;

    case "admin":
      return <Dashboard />;

    case "superadmin":
      return <SuperAdmin />; // 👈 AQUÍ VA BIEN

    default:
      return <Login />;
  }
}

export default App;