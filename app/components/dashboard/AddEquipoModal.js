"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { token } from "../../components/protectedRoute";

function AddEquipoModal({ equipos, setEquipos, closeModal, equipoToEdit }) {
  const [Estatus, setEstatus] = useState("");
  const [NumeroEquipo, setNumeroEquipo] = useState("");
  const [NumeroSerie, setNumeroSerie] = useState("");
  const [IdProductos, setIdProductos] = useState("");
  const [idUbicaciones, setIdUbicaciones] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [ubicaciones, setUbicaciones] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchUbicaciones = async () => {
    try {
      const response = await fetch(
        "https://backend-integradora.vercel.app/api/ubicacion",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUbicaciones(data);
    } catch (error) {
      console.error("Error fetching Ubicaciones:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch(
        "https://backend-integradora.vercel.app/api/productos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching Productos:", error);
    }
  };

  // Populate form fields if editing
  useEffect(() => {
    fetchUbicaciones();
    fetchProductos();
    if (equipoToEdit && Object.keys(equipoToEdit).length > 0) {
      setEstatus(equipoToEdit.estatus || equipoToEdit.Estatus || "");
      setNumeroEquipo(
        equipoToEdit.numeroEquipo || equipoToEdit.NumeroEquipo || ""
      );
      setNumeroSerie(
        equipoToEdit.numeroSerie || equipoToEdit.NumeroSerie || ""
      );
      setIdProductos(
        equipoToEdit.idProductos || equipoToEdit.IdProductos || ""
      );
      setIdUbicaciones(
        equipoToEdit.idUbicaciones || equipoToEdit.IdUbicaciones || ""
      );
    }
  }, [equipoToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Datos del producto a enviar
    const equipoData = {
      Estatus,
      NumeroEquipo,
      NumeroSerie,
      IdProductos,
      idUbicaciones,
    };

    try {
      let response;

      if (equipoToEdit) {
        // Editar producto existente
        response = await fetch(
          `https://backend-integradora.vercel.app/api/equipos/${equipoToEdit.idEquipos}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(equipoData),
          }
        );
      } else {
        // Agregar nuevo producto
        response = await fetch(
          "https://backend-integradora.vercel.app/api/equipos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(equipoData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Error al guardar el producto");
      }

      // Obtener el resultado de la respuesta
      const result = await response.json();

      if (equipoToEdit) {
        // Actualizar el producto editado en el estado
        setSuccessMessage(`Producto actualizado con ID: ${result.equipo.id}`);
        setEquipos((prev) =>
          prev.map((p) => (p.id === result.equipo.id ? result.equipo : p))
        );
      } else {
        // Agregar el nuevo producto al estado
        setSuccessMessage(`Producto agregado con ID: ${result.equipo.id}`);
        setEquipos((prev) => [...prev, result.equipo]);
      }

      // Cerrar el modal y limpiar los campos si es necesario
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {equipoToEdit ? "Editar Equipo" : "Agregar Equipo"}
        </h2>

        {/* Alerta de éxito */}
        {successMessage && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        {/* Alerta de error */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Campo Numero de Serie */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Número de Serie
              </label>
              <input
                type="text"
                value={NumeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Número de serie del equipo"
                required
              />
            </div>

            {/* Campo Número de Equipo */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Número de Equipo
              </label>
              <input
                type="text"
                value={NumeroEquipo}
                onChange={(e) => setNumeroEquipo(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Número de equipo (M20, CED3)"
                required
              />
            </div>

            {/* Campo Ubicacion */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Ubicación
              </label>
              <div className="relative">
                <select
                  value={idUbicaciones}
                  onChange={(e) => setIdUbicaciones(e.target.value)}
                  className="w-full appearance-none p-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent text-gray-600"
                >
                  <option value="">Selecciona la ubicación</option>
                  {ubicaciones.map((ubicacion) => (
                    <option
                      key={ubicacion.idUbicaciones}
                      value={ubicacion.idUbicaciones}
                    >
                      {ubicacion.Nombre}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Campo Producto */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Producto
              </label>
              <div className="relative">
                <select
                  value={IdProductos}
                  onChange={(e) => setIdProductos(e.target.value)}
                  className="w-full appearance-none p-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent text-gray-600"
                >
                  <option value="">Selecciona el producto</option>
                  {products.map((product) => (
                    <option
                      key={product.idProductos}
                      value={product.idProductos}
                    >
                      {product.modelo} ({product.Existencia})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
            {/* Campo Estatus */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Estatus
              </label>
              <div className="relative">
                <select
                  value={Estatus}
                  onChange={(e) => setEstatus(e.target.value)}
                  className="w-full appearance-none p-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent text-gray-600"
                >
                  <option value="">Selecciona el estatus</option>
                  <option value="activo">Activo</option>
                  <option value="inventariado">Inventariado</option>
                  <option value="reparacion">En reparación</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm font-medium hover:bg-[#1a42b6] focus:outline-none focus:ring-2 focus:ring-[#1a42b6]"
            >
              {equipoToEdit ? "Guardar Cambios" : "Agregar Equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEquipoModal;
