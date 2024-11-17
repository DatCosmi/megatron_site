"use client";
import { useEffect, useState } from "react";
import { RoleProvider } from "../components/context/RoleContext";
import Sidebar from "../components/dashboard/sidebar";
import ProtectedRoute, { token } from "../components/protectedRoute";
import { FaUser } from "react-icons/fa";
import ChangePasswordModal from "../components/dashboard/ChangePasswordModal";
import EditDataModal from "../components/dashboard/EditDataModal";

function SettingsPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPa: "",
    apellidoMa: "",
    telefono: "",
    correoElectronico: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    const idFromStorage = localStorage.getItem("id");
    setRole(roleFromStorage);
    setId(idFromStorage);
    if (roleFromStorage && idFromStorage)
      fetchUser(roleFromStorage, idFromStorage);
    else {
      setError("Role o ID del usuario no encontrados en localStorage.");
      setLoading(false);
    }
  }, []);

  const fetchUser = async (role, idUser) => {
    try {
      const endpointMap = {
        cliente: `https://backend-integradora.vercel.app/api/clienteById/${idUser}`,
        tecnico: `https://backend-integradora.vercel.app/api/tecnicoById/${idUser}`,
        admin: `https://backend-integradora.vercel.app/api/auth/getUser/${idUser}`,
      };
      const response = await fetch(endpointMap[role], {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const result = await response.json();
      setUserData(result);
      if (role !== "admin") {
        setFormData({
          nombre: result.nombre,
          apellidoPa: result.ApellidoPa,
          apellidoMa: result.ApellidoMa,
          telefono: result.Telefono,
          correoElectronico: result.CorreoElectronico,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/auth/update-password/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: passwordData.newPassword }),
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      alert("Contraseña actualizada exitosamente");
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateData = async () => {
    try {
      const endpointMap = {
        cliente: `https://backend-integradora.vercel.app/api/clientes/${userData.idClientes}`,
        tecnico: `https://backend-integradora.vercel.app/api/tecnicos/${userData.idTecnicos}`,
      };
      const response = await fetch(endpointMap[role], {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      alert("Datos actualizados exitosamente");
      setUserData({ ...userData, ...formData });
      const roleFromStorage = localStorage.getItem("role");
      const idFromStorage = localStorage.getItem("id");
      fetchUser(roleFromStorage, idFromStorage);
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <RoleProvider>
      <ProtectedRoute>
        <div className="flex h-screen bg-[#eaeef6]">
          <Sidebar />
          <div className="p-8 w-full flex justify-center items-center">
            <div className="max-w-md bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-center">
                <FaUser className="text-white text-4xl mb-2 mx-auto" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {role === "admin" ? userData.user : userData.nombre}
                </h2>
                <p className="text-gray-200 text-sm">
                  {role !== "admin" && userData?.CorreoElectronico}
                </p>
              </div>
              <div className="p-6">
                {role !== "admin" && (
                  <>
                    <p className="text-gray-700 mb-4">
                      {" "}
                      <strong>Apellidos:</strong> {userData.ApellidoPa}{" "}
                      {userData.ApellidoMa}
                    </p>
                    <p className="text-gray-700 mb-4">
                      {" "}
                      <strong>Teléfono:</strong> {userData.Telefono}
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
        </div>
        {isModalOpen && (
          <ChangePasswordModal
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            handleUpdatePassword={handleUpdatePassword}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {isEditModalOpen && (
          <EditDataModal
            formData={formData}
            setFormData={setFormData}
            handleUpdateData={handleUpdateData}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </ProtectedRoute>
    </RoleProvider>
  );
}

export default SettingsPage;
