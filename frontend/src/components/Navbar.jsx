import "../assets/navbar.css";

function Navbar() {
  const rol = localStorage.getItem("rol");

  const handleLogout = () => {
    // logout más limpio
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      {/* IZQUIERDA */}
      <div className="navbar-left">
        <div className="logo-box">💊</div>

        <div className="brand">
          <h2>Botica Nova Salud</h2>
          <span className="subtitle">Sistema de gestión farmacéutica</span>
        </div>
      </div>

      {/* DERECHA */}
      <div className="navbar-right">
        <span className={`rol-badge rol-${rol}`}>
          {rol}
        </span>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Navbar;