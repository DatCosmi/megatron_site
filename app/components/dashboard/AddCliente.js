"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/UsuarioContext";
import toast, { Toaster } from "react-hot-toast";
function AddClienteModal({ clientes, setClientes, closeModal, clienteToEdit }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPa, setApellidoPa] = useState("");
  const [apellidoMa, setApellidoMa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");

  const { authState } = useContext(AuthContext);
  const { token } = authState;

  const [usersId, setUsersId] = useState("");
  const [clienteId, setClienteId] = useState("");

  const [currentTab, setCurrentTab] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Populate form fields if editing
  useEffect(() => {
    if (clienteToEdit) {
      setUsersId(clienteToEdit.idusers || "");
      setClienteId(clienteToEdit.idClientes || "");
      if (clienteToEdit.idClientes) fetchClienteData(clienteToEdit.idClientes);
      if (clienteToEdit.idusers) fetchUserData(clienteToEdit.idusers);
    }
  }, [clienteToEdit]);

  const fetchClienteData = async (id) => {
    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/clientes/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Error al obtener los datos del cliente");

      const data = await response.json();
      setNombre(data.Nombre || "");
      setApellidoPa(data.ApellidoPa || "");
      setApellidoMa(data.ApellidoMa || "");
      setTelefono(data.Telefono || "");
      setCorreoElectronico(data.CorreoElectronico || "");
    } catch (err) {
      setError(err.message || "Algo salió mal al obtener datos del cliente");
    }
  };

  const fetchUserData = async (id) => {
    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/auth/getUser/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Error al obtener los datos del usuario");

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err.message || "Algo salió mal al obtener datos del usuario");
    }
  };

  const handleNextTab = () => {
    if (clienteToEdit || (user.trim() && password.trim())) {
      setCurrentTab(2);
      setError("");
    } else {
      setError("Por favor, completa todos los campos en esta pestaña");
    }
  };

  const handleBackTab = () => {
    setCurrentTab(1);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clienteData = {
      nombre,
      apellidoPa,
      apellidoMa,
      telefono,
      correoElectronico,
    };

    try {
      let userResponse;

      if (clienteToEdit) {
        // Update existing client and user
        userResponse = await fetch(
          `https://backend-integradora.vercel.app/api/auth/update-password/${usersId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ password }),
          }
        );
        if (!userResponse.ok) {
          toast.error("Error al actualizar la contraseña");
          throw new Error("Error al actualizar la contraseña");
        }

        const clienteResponse = await fetch(
          `https://backend-integradora.vercel.app/api/clientes/${clienteId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(clienteData),
          }
        );
        if (!clienteResponse.ok) {
          toast.error("Error al actualizar los datos del cliente");
          throw new Error("Error al actualizar los datos del cliente");
        }

        setSuccessMessage("Cliente actualizado exitosamente");
        closeModal();
        toast.success("Cliente actualizado exitosamente");
      } else {
        // Create new user and client
        const userData = {
          user,
          password,
          rol: "cliente",
        };

        userResponse = await fetch(
          `https://backend-integradora.vercel.app/api/auth/registrar`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          }
        );
        if (!userResponse.ok) {
          toast.error("Error al guardar los datos del usuario");
          throw new Error("Error al guardar los datos del usuario");
        }

        const userResult = await userResponse.json();
        const users_idusers = userResult.userId;

        const clienteResponse = await fetch(
          `https://backend-integradora.vercel.app/api/clientes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...clienteData, users_idusers }),
          }
        );

        if (!clienteResponse.ok) {
          toast.error("Error al guardar los datos del cliente");
          throw new Error("Error al guardar los datos del cliente");
        }

        const result = await clienteResponse.json();
        setSuccessMessage("Cliente agregado exitosamente");
        setClientes((prev) => [...prev, result]);
        closeModal();
        toast.success("Cliente agregado exitosamente");
      }
    } catch (error) {
      setError(error.message || "Algo salió mal");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg relative">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {clienteToEdit ? "Editar Cliente" : "Agregar Cliente"}
        </h2>

        {/* Success and Error Alerts */}
        {successMessage && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tabs for input */}
          {currentTab === 1 && (
            <div className="space-y-5">
              <label className="block font-medium text-gray-700">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                disabled={!!clienteToEdit}
                required={!clienteToEdit}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <label className="block font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  clienteToEdit ? "Dejar vacío para no actualizar" : ""
                }
                required={!clienteToEdit}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm font-medium hover:bg-[#1a42b6]"
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
              <div className="flex space-x-6 mt-6">
                <button
                  type="button"
                  onClick={handleBackTab}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm font-medium hover:bg-[#1a42b6]"
                >
                  {clienteToEdit ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default AddClienteModal;
