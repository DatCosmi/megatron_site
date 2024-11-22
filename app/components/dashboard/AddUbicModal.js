"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/UsuarioContext";
import { ChevronDown } from "lucide-react";
function AddUbicModal({
  ubicaciones,
  setUbicaciones,
  closeModal,
  ubicacionToEdit,
}) {
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [direccion, setDireccion] = useState("");
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [clientes_idClientes, setClientes_idClientes] = useState("");

  const { authState } = useContext(AuthContext);
  const { token } = authState;

  // Populate form fields if editing
  useEffect(() => {
    fetchClientes();
    if (ubicacionToEdit && Object.keys(ubicacionToEdit).length > 0) {
      setNombre(ubicacionToEdit.nombre || ubicacionToEdit.Nombre || "");
      setCiudad(ubicacionToEdit.ciudad || ubicacionToEdit.Ciudad || "");
      setEstado(ubicacionToEdit.estado || ubicacionToEdit.Estado || "");
      setCodigoPostal(
        ubicacionToEdit.codigoPostal || ubicacionToEdit.CodigoPostal || ""
      );
      setDireccion(
        ubicacionToEdit.direccion || ubicacionToEdit.Direccion || ""
      );
      setClientes_idClientes(ubicacionToEdit.clientes_idClientes || "");
    }
  }, [ubicacionToEdit]);

  const fetchClientes = async () => {
    try {
      const response = await fetch(
        "https://backend-integradora.vercel.app/api/clientes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setClientes(data);
    } catch (error) {
      console.error("Error fetching Ubicaciones:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Data to send for location
    const ubicData = {
      nombre,
      ciudad,
      estado,
      codigoPostal,
      direccion,
      clientes_idClientes,
    };

    try {
      let response;

      if (ubicacionToEdit) {
        // Edit existing location
        response = await fetch(
          `https://backend-integradora.vercel.app/api/ubicacion/${ubicacionToEdit.idUbicaciones}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ubicData),
          }
        );
      } else {
        // Add new location
        response = await fetch(
          "https://backend-integradora.vercel.app/api/ubicacion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ubicData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Error al guardar la ubicación");
      }

      // Get the response result
      const result = await response.json();

      if (ubicacionToEdit) {
        // Update the edited location in state
        setSuccessMessage(
          `Ubicación actualizada con ID: ${result.ubicacion.ididUbicaciones}`
        );
        setUbicaciones((prev) =>
          prev.map((u) => (u.id === result.ubicacion.id ? result.ubicacion : u))
        );
      } else {
        // Add new location to state
        setSuccessMessage(
          `Ubicación agregada con ID: ${result.ubicacion.idUbicaciones}`
        );
        setUbicaciones((prev) => [...prev, result.ubicacion]);
      }

      // Close modal after successful operation
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
          {ubicacionToEdit ? "Editar Ubicación" : "Agregar Ubicación"}
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Nombre de la ubicación"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Clientes
              </label>
              <div className="relative">
                <select
                  value={clientes_idClientes}
                  onChange={(e) => setClientes_idClientes(e.target.value)}
                  className="w-full appearance-none p-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent text-gray-600"
                >
                  <option value="">Selecciona el cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.idClientes} value={cliente.idClientes}>
                      {cliente.Nombre} {cliente.ApellidoPa} {cliente.ApellidoMa}
                    </option>
                  ))}
                </select>

                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Ciudad
              </label>
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Ciudad de la ubicación"
                required
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Estado
              </label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Estado de la ubicación"
                required
              />
            </div>

            {/* Código Postal */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Código Postal
              </label>
              <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Código Postal"
                required
              />
            </div>

            {/* Dirección */}
            <div className="col-span-2">
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Dirección
              </label>
              <textarea
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Dirección completa de la ubicación"
                required
              />
            </div>
          </div>

          {/* Buttons */}
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
              {ubicacionToEdit ? "Guardar Cambios" : "Agregar Ubicación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUbicModal;
