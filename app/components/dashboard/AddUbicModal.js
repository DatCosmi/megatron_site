"use client";
import { useEffect, useState } from "react";

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

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Populate form fields if editing
  useEffect(() => {
    if (ubicacionToEdit && Object.keys(ubicacionToEdit).length > 0) {
      setNombre(ubicacionToEdit.nombre || "");
      setCiudad(ubicacionToEdit.ciudad || "");
      setEstado(ubicacionToEdit.estado || "");
      setCodigoPostal(ubicacionToEdit.codigoPostal || "");
      setDireccion(ubicacionToEdit.direccion || "");
    }
  }, [ubicacionToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Data to send for location
    const ubicData = {
      nombre,
      ciudad,
      estado,
      codigoPostal,
      direccion,
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
        setSuccessMessage(`Ubicación actualizada con ID: ${result.ubicacion.ididUbicaciones}`);
        setUbicaciones((prev) =>
          prev.map((u) =>
            u.id === result.ubicacion.id ? result.ubicacion : u
          )
        );
      } else {
        // Add new location to state
        setSuccessMessage(`Ubicación agregada con ID: ${result.ubicacion.idUbicaciones}`);
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

            {/* Ciudad */}
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
