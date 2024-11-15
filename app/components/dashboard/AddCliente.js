"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

function AddClienteModal({ clientes, setClientes, closeModal, clienteToEdit }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Populate form fields if editing
  useEffect(() => {
    if (clienteToEdit && Object.keys(clienteToEdit).length > 0) {
      setUser(clienteToEdit.user || clienteToEdit.User || "");
      setPassword(clienteToEdit.password || clienteToEdit.Password || "");
    }
  }, [clienteToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Datos del producto a enviar
    const clienteData = {
      user,
      password,
      rol: "cliente",
    };

    try {
      let response;

      if (clienteToEdit) {
        // Editar producto existente
        response = await fetch(
          `https://backend-integradora.vercel.app/api/productos/${productToEdit.idProductos}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(clienteData),
          }
        );
      } else {
        // Agregar nuevo producto
        response = await fetch(
          "https://backend-integradora.vercel.app/api/auth/registrar", //admin, cliente, tecnico
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(clienteData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Error al guardar el usuario");
      }

      // Obtener el resultado de la respuesta
      const result = await response.json();

      if (clienteToEdit) {
        // Actualizar el producto editado en el estado
        setSuccessMessage(`Producto actualizado con ID: ${result.user.id}`);
        setUser((prev) =>
          prev.map((p) => (p.id === result.user.id ? result.user : p))
        );
      } else {
        // Agregar el nuevo producto al estado
        setSuccessMessage(`Producto agregado con ID: ${result.user.id}`);
        setUser((prev) => [...prev, result.user]);
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
          {clienteToEdit ? "Editar Usuario" : "Agregar Usuario"}
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
            {/* Campo Usuario */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Nombre de usuario"
                required
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Contraseña"
                required
              />
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
              {clienteToEdit ? "Guardar Cambios" : "Agregar Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClienteModal;
