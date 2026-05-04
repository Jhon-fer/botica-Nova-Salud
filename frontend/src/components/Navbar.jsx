import "../assets/navbar.css";

function Navbar() {
  const rol = localStorage.getItem("rol");

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <span className="logo">💊</span>
        <h2>Botica Nova Salud</h2>
      </div>

      <div className="navbar-right">
        <span className="rol">{rol}</span>

        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Navbar;