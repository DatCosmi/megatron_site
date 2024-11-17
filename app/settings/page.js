"use client";
import { useEffect, useState } from "react";
import { RoleProvider } from "../components/context/RoleContext";
import Sidebar from "../components/dashboard/sidebar";
import ProtectedRoute, { token } from "../components/protectedRoute";
import { FaUser } from "react-icons/fa"; // Icono de usuario

function SettingsPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellidoPa, setApellidoPa] = useState("");
  const [apellidoMa, setApellidoMa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false); // Estado para la comparación de contraseñas
  const [IdClientes, setIdClientes] = useState("");
  const [IdTecnicos, setIdTecnicos] = useState("");

  const [role, setRole] = useState(null);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    setRole(roleFromStorage); // Setting role from localStorage
    const idUser = localStorage.getItem("id");
    if (roleFromStorage && idUser) {
      fetchUser(roleFromStorage, idUser);
    } else {
      setError("Role o ID del usuario no encontrados en localStorage.");
      setLoading(false);
    }
  }, []);

  const fetchUser = async (role, idUser) => {
    try {
      let response;

      if (role === "cliente") {
        response = await fetch(
          `https://backend-integradora.vercel.app/api/clienteById/${idUser}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (role === "tecnico") {
        response = await fetch(
          `https://backend-integradora.vercel.app/api/tecnicoById/${idUser}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (role === "admin") {
        response = await fetch(
          `https://backend-integradora.vercel.app/api/auth/getUser/${idUser}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
      }

      if (!response) {
        throw new Error("No se recibió respuesta de la API.");
      }

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      
      const result = await response.json();

      setUserData(result);


      if (role !== "admin") {
        setNombre(result.nombre);
        setApellidoPa(result.ApellidoPa);
        setApellidoMa(result.ApellidoMa);
        setTelefono(result.Telefono);
        setCorreoElectronico(result.CorreoElectronico);
        if (role === "cliente") {
          setIdClientes(result.idClientes);
        }
        if (role === "tecnico") {
          setIdTecnicos(result.idTecnicos);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const userId = localStorage.getItem("id");
    if (!userId) {
      alert("No se encontró el ID de usuario.");
      return;
    }

    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/auth/update-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al actualizar la contraseña: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Contraseña actualizada con éxito", result);

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al actualizar la contraseña:", err.message);
      alert("Hubo un error al actualizar la contraseña. Intenta nuevamente.");
    }
  };
  const handleUpdateData = async () => {
    const userData = {
      nombre,
      apellidoPa,
      apellidoMa,
      telefono,
      correoElectronico,
    };

    try {
      let response;

      if (role === "cliente") {
        response = await fetch(
          `https://backend-integradora.vercel.app/api/clientes/${IdClientes}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          }
        );
      } else if (role === "tecnico") {
        response = await fetch(
          `https://backend-integradora.vercel.app/api/tecnicos/${IdTecnicos}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          `Error al actualizar los datos: ${response.statusText}`
        );
      }

      alert("Datos actualizados correctamente");
      // Actualizamos el estado con los nuevos datos
      setUserData((prevState) => ({
        ...prevState,
        nombre,
        ApellidoPa: apellidoPa,
        ApellidoMa: apellidoMa,
        Telefono: telefono,
        CorreoElectronico: correoElectronico,
      }));
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = () => {
    setPasswordMatch(newPassword === confirmPassword);
  };

  useEffect(() => {
    handlePasswordChange();
  }, [newPassword, confirmPassword]);

  if (loading) {
    return <div className="text-gray-500 text-center"></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <RoleProvider>
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="p-8 w-full flex justify-center items-center">
            <div className="max-w-md bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-center">
                <FaUser className="text-white text-4xl mb-2 mx-auto" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {userData
                    ? role === "admin"
                      ? userData.user
                      : userData.nombre
                    : "Cargando..."}
                </h2>
                <p className="text-gray-200 text-sm">
                  {role !== "admin" && userData?.CorreoElectronico}
                </p>
              </div>
              <div className="p-6">
                {(role === "cliente" || role === "tecnico") &&
                  role !== "admin" && (
                    <>
                      <p className="text-gray-700 mb-4">
                        <strong>Apellidos:</strong> {userData.ApellidoPa}{" "}
                        {userData.ApellidoMa}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <strong>Teléfono:</strong> {userData.Telefono}
                      </p>
                      <p className="text-gray-700 mb-6">
                        <strong>Usuario:</strong> {userData.user}
                      </p>
                    </>
                  )}

                <div className="flex space-x-4">
                  <button
                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Cambiar Contraseña
                  </button>
                  {role !== "admin" && (
                    <button
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Editar Datos
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal de cambiar contraseña */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">Cambiar Contraseña</h3>
                <input
                  type="password"
                  placeholder="Nueva Contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                />
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                />
                {!passwordMatch && newPassword && confirmPassword && (
                  <p className="text-red-500 text-sm mb-4">
                    Las contraseñas no coinciden.
                  </p>
                )}
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="py-2 px-4 bg-gray-500 text-white rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de editar datos */}
          {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">Editar Datos</h3>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                />
                <input
                  type="text"
                  placeholder="Apellido Paterno"
                  value={apellidoPa}
                  onChange={(e) => setApellidoPa(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                />
                <input
                  type="text"
                  placeholder="Apellido Materno"
                  value={apellidoMa}
                  onChange={(e) => setApellidoMa(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                />
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="py-2 px-4 bg-gray-500 text-white rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateData}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                  >
                    Actualizar Datos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ProtectedRoute>
    </RoleProvider>
  );
}

export default SettingsPage;
