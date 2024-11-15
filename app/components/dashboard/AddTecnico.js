"use client";
import { useEffect, useState } from "react";

function AddTecnicoModal({ clientes, setClientes, closeModal, tecnicoToEdit }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPa, setApellidoPa] = useState("");
  const [apellidoMa, setApellidoMa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [usersId, setUsersId] = useState("");

  const [currentTab, setCurrentTab] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Rellenar los campos del formulario si es edición
  useEffect(() => {
    if (tecnicoToEdit && Object.keys(tecnicoToEdit).length > 0) {
      setUser(tecnicoToEdit.user || tecnicoToEdit.User || "");
      setPassword(tecnicoToEdit.password || tecnicoToEdit.Password || "");
      setNombre(tecnicoToEdit.Nombre || "");
      setApellidoPa(tecnicoToEdit.ApellidoPa || "");
      setApellidoMa(tecnicoToEdit.ApellidoMa || "");
      setTelefono(tecnicoToEdit.Telefono || "");
      setCorreoElectronico(tecnicoToEdit.CorreoElectronico || "");
      setUsersId(tecnicoToEdit.users_idusers || "");
    }
  }, [tecnicoToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tecnicoData = {
      user,
      password,
      rol: "tecnico",
    };

    try {
      // Primera solicitud para registrar el usuario (rol: tecnico)
      let response = await fetch(
        "https://backend-integradora.vercel.app/api/auth/registrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tecnicoData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el usuario");
      }

      // Si la primera solicitud es exitosa, se obtiene el userId y se realiza la segunda solicitud para guardar el técnico
      const result = await response.json();
      const tecnicoDetails = {
        Nombre: nombre,
        ApellidoPa: apellidoPa,
        ApellidoMa: apellidoMa,
        Telefono: telefono,
        CorreoElectronico: correoElectronico,
        users_idusers: result.userId,
        Estatus: "Inactivo", // O "Activo", dependiendo de la lógica de tu sistema
      };

      response = await fetch(
        "https://backend-integradora.vercel.app/api/tecnicos", // Cambia la URL a la de los técnicos si es diferente
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tecnicoDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el técnico");
      }

      setSuccessMessage("Usuario y técnico agregados exitosamente");
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      closeModal();
    }
  };

  const handleNextTab = () => {
    if (user.trim() && password.trim()) {
      setCurrentTab(2);
      setError("");
    } else {
      setError("Por favor, completa todos los campos en esta pestaña");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg relative">
        {/* Botón de cierre en la esquina superior derecha */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {tecnicoToEdit ? "Editar Técnico" : "Agregar Técnico"}
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
          {currentTab === 1 && (
            <div className="space-y-5">
              <label className="block font-medium text-gray-700">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <label className="block font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm font-medium hover:bg-[#1a42b6] focus:outline-none focus:ring-2 focus:ring-[#1a42b6]"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {currentTab === 2 && (
            <div className="space-y-5">
              <label className="block font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <label className="block font-medium text-gray-700">
                Apellido Paterno
              </label>
              <input
                type="text"
                value={apellidoPa}
                onChange={(e) => setApellidoPa(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <label className="block font-medium text-gray-700">
                Apellido Materno
              </label>
              <input
                type="text"
                value={apellidoMa}
                onChange={(e) => setApellidoMa(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <label className="block font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <label className="block font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={correoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm font-medium hover:bg-[#1a42b6] focus:outline-none focus:ring-2 focus:ring-[#1a42b6]"
                >
                  {tecnicoToEdit ? "Guardar Cambios" : "Agregar Técnico"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddTecnicoModal;
