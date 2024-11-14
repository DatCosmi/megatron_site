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

  useEffect(() => {
    if (ubicacionToEdit) {
      setNombre(ubicacionToEdit.nombre || "");
      setCiudad(ubicacionToEdit.ciudad || "");
      setEstado(ubicacionToEdit.estado || "");
      setCodigoPostal(ubicacionToEdit.codigoPostal || "");
      setDireccion(ubicacionToEdit.direccion || "");
    } else {
      setNombre("");
      setCiudad("");
      setEstado("");
      setCodigoPostal("");
      setDireccion("");
    }
  }, [ubicacionToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        response = await fetch(
          `https://backend-integradora.vercel.app/api/ubicacion/${ubicacionToEdit.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre,
              ciudad,
              estado,
              codigoPostal,
              direccion,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error al actualizar la ubicación");
        }
        setSuccessMessage("Ubicación actualizada exitosamente");
        setUbicaciones((prevUbicaciones) =>
          prevUbicaciones.map((ubicacion) =>
            ubicacion.id === ubicacionToEdit.id
              ? {
                  ...ubicacion,
                  nombre,
                  ciudad,
                  estado,
                  codigoPostal,
                  direccion,
                }
              : ubicacion
          )
        );
      } else {
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
      if (response.ok) {
        const result = await response.json();
        if (ubicacionToEdit.id) {
          setSuccessMessage(`Ubicacion updated with ID: ${result.ubicaciones.id}`);
          setUbicaciones((prev) =>
            prev.map((p) => (p.id === result.ubicacion.id ? result.ubicacion : p))
          );
        } else {
          setSuccessMessage(`Product added with ID: ${result.product.id}`);
          setUbicaciones((prev) => [...prev, result.product]);
        }
        closeModal();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save product");
      }
    } catch (error) {
      setError(error.message);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Agregar Ubicación
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
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
                Ciudad
              </label>
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Ciudad donde se encuentra la ubicación"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Estado
              </label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Estado"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Código Postal
              </label>
              <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Código postal"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Dirección
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Dirección completa"
                required
              />
            </div>
          </div>

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
              className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm font-medium hover:bg-[#1a42b6] focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
            >
              Agregar Ubicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUbicModal;
