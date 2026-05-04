import Login from "./pages/Login";
import Home from "./pages/Home";
import Ventas from "./pages/Ventas";
import Productos from "./pages/Productos";

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
      return <Productos />;

    case "superadmin":
      return <Home />;

    default:
      return <Login />;
  }
}

export default App;