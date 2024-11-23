"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/UsuarioContext";
import toast, { Toaster } from 'react-hot-toast';
function AddTecnicoModal({
  Technicians,
  setTechnicians,
  closeModal,
  tecnicoToEdit,
}) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [estatus, setEstatus] = useState("");
  const [apellidoPa, setApellidoPa] = useState("");
  const [apellidoMa, setApellidoMa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");

  const { authState } = useContext(AuthContext);
  const { token } = authState;

  const [usersId, setUsersId] = useState("");
  const [TecnicoId, setTecnicoId] = useState("");

  const [currentTab, setCurrentTab] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (tecnicoToEdit && Object.keys(tecnicoToEdit).length > 0) {
      setTecnicoId(tecnicoToEdit.idTecnicos || "");
      setUsersId(tecnicoToEdit.idusers || "");
      if (tecnicoToEdit.idTecnicos) fetchTecnicoData(tecnicoToEdit.idTecnicos);
      if (tecnicoToEdit.idusers) fetchUserData(tecnicoToEdit.idusers);
    }
  }, [tecnicoToEdit]); // Depender de tecnicoToEdit asegura que se ejecute correctamente

  const fetchTecnicoData = async (id) => {
    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/tecnicos/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Error al obtener los datos del técnico");

      const data = await response.json();
      setNombre(data.Nombre || "");
      setApellidoPa(data.ApellidoPa || "");
      setApellidoMa(data.ApellidoMa || "");
      setTelefono(data.Telefono || "");
      setCorreoElectronico(data.CorreoElectronico || "");
      setEstatus(data.Estatus || "Activo");
    } catch (err) {
      setError(err.message || "Algo salió mal al obtener datos del técnico");
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
    if (tecnicoToEdit || (user.trim() && password.trim())) {
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

    const tecnicoData = {
      nombre,
      apellidoPa,
      apellidoMa,
      telefono,
      correoElectronico,
      estatus,
    };

    try {
      if (tecnicoToEdit) {
        // Actualizar técnico
        const tecnicoResponse = await fetch(
          `https://backend-integradora.vercel.app/api/tecnicos/${TecnicoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(tecnicoData),
          }
        );

        if (!tecnicoResponse.ok)
          
          toast.error("Error al actualizar los datos del técnico");
          throw new Error("Error al actualizar los datos del técnico");

        if (password.trim()) {
          // Actualizar contraseña
          const passwordResponse = await fetch(
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

          if (!passwordResponse.ok)
            
          toast.error("Error al actualizar la contraseña");
            throw new Error("Error al actualizar la contraseña");
        }

        
      toast.success("Tecnico actulizado exitosamente");
      } else {
        const userData = {
          user,
          password,
          rol: "tecnico",
        };
        // Crear técnico
        const userResponse = await fetch(
          `https://backend-integradora.vercel.app/api/auth/registrar`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...userData }),
          }
        );
        if (!userResponse.ok)
          
          toast.error("Error al guardar los datos del tecnico");
          throw new Error("Error al guardar los datos del tecnico");
        const UserResult = await userResponse.json();
        const users_idusers = UserResult.userId;
        const tecnicoResponse = await fetch(
          `https://backend-integradora.vercel.app/api/tecnicos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...tecnicoData, users_idusers }),
          }
        );

        if (!tecnicoResponse.ok)
          
          toast.error("Error al guardar los datos del usuario");
          throw new Error("Error al guardar los datos del técnico");

        const result = await tecnicoResponse.json();
        
      toast.success("Tecnico agregado exitosamente");
        setTechnicians((prev) => [...prev, result]);
      }

      closeModal();
    } catch (err) {
      setError(err.message || "Algo salió mal al guardar los datos");
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
          {tecnicoToEdit ? "Editar Técnico" : "Agregar Técnico"}
        </h2>

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
          {currentTab === 1 && (
            <>
              <label className="block font-medium text-gray-700">Usuario</label>

              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!!tecnicoToEdit}
                required={!tecnicoToEdit}
              />

              <label className="block font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={
                  tecnicoToEdit ? "Dejar vacío para no actualizar" : ""
                }
                required={!tecnicoToEdit}
              />

              <button
                type="button"
                onClick={handleNextTab}
                className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm"
              >
                Siguiente
              </button>
            </>
          )}

          {currentTab === 2 && (
            <>
              <label className="block font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />

              <label className="block font-medium text-gray-700">
                Apellido Paterno
              </label>
              <input
                type="text"
                value={apellidoPa}
                onChange={(e) => setApellidoPa(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />

              <label className="block font-medium text-gray-700">
                Apellido Materno
              </label>
              <input
                type="text"
                value={apellidoMa}
                onChange={(e) => setApellidoMa(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />

              <label className="block font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={correoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />

              <label className="block font-medium text-gray-700">Estatus</label>
              <select
                value={estatus}
                onChange={(e) => setEstatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>

              <div className="flex justify-between mt-5">
                <button
                  type="button"
                  onClick={handleBackTab}
                  className="px-6 py-3 bg-gray-400 text-white rounded-lg text-sm"
                >
                  Anterior
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm"
                >
                  {tecnicoToEdit ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default AddTecnicoModal;
