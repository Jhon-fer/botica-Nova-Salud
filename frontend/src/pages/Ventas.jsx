import { useEffect, useState } from "react";
import {
  getProductos,
  crearVenta,
  getBajoStock
} from "../services/api";
import Navbar from "../components/Navbar";
import "../assets/ventas.css";

function Ventas() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [alertas, setAlertas] = useState([]);

  const formatSoles = (monto) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);

  const cargarProductos = () => {
    getProductos()
      .then(data => setProductos(data.data || data))
      .catch(err => console.error(err));
  };

  const cargarAlertas = () => {
    getBajoStock()
      .then(data => setAlertas(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarProductos();
    cargarAlertas();
  }, []);

  const agregarCarrito = (producto) => {
    const existe = carrito.find(p => p.id === producto.id);

    if (existe) {
      setCarrito(
        carrito.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const total = carrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const finalizarVenta = async () => {
    try {
      await crearVenta({ productos: carrito });

      alert("Venta realizada 💰");

      setCarrito([]);
      cargarProductos();
      cargarAlertas();
    } catch (error) {
      console.error(error);
      alert("Error ❌");
    }
  };

  return (
    <div className="ventas-container">
      <Navbar />

      <h1>💰 Ventas</h1>

      {/* ALERTAS */}
      <div className="alertas">
        <h3>⚠️ Bajo stock</h3>
        {alertas.map(a => (
          <p key={a.id}>
            {a.nombre} (Stock: {a.stock})
          </p>
        ))}
      </div>

      <div className="ventas-grid">
        {/* PRODUCTOS */}
        <div className="productos">
          {productos.map((p) => (
            <div key={p.id} className="producto-card">
              <h4>{p.nombre}</h4>
              <p>{formatSoles(p.precio)}</p>
              <p>Stock: {p.stock}</p>

              <button onClick={() => agregarCarrito(p)}>
                Agregar
              </button>
            </div>
          ))}
        </div>

        {/* CARRITO */}
        <div className="carrito">
          <h3>🛒 Carrito</h3>

          {carrito.map((p) => (
            <div key={p.id} className="carrito-item">
              <p>{p.nombre}</p>
              <p>{p.cantidad} x {formatSoles(p.precio)}</p>
            </div>
          ))}

          <h2>Total: {formatSoles(total)}</h2>

          <button onClick={finalizarVenta} className="btn-finalizar">
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ventas;