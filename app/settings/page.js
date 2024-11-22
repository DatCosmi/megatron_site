"use client"
import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/navigation/sidebar";
import { FaUser } from "react-icons/fa";
import ChangePasswordModal from "../components/dashboard/ChangePasswordModal";
import EditDataModal from "../components/dashboard/EditDataModal";
import { AuthContext } from "../context/UsuarioContext";

function SettingsPage() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { authState, loadUserDetails } = useContext(AuthContext); 
  const { rol, iduser, userDetails, token, user } = authState;
  console.log(authState);

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

  useEffect(() => {
    if (rol && iduser) {
      loadUserDetails(rol, iduser); 
    }
  }, [rol, iduser]);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        nombre: userDetails.nombre || "",
        apellidoPa: userDetails.ApellidoPa || "",
        apellidoMa: userDetails.ApellidoMa || "",
        telefono: userDetails.Telefono || "",
        correoElectronico: userDetails.CorreoElectronico || "",
      });
    }
  }, [userDetails]);

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/auth/update-password/${iduser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: passwordData.newPassword }),
        }
      );
      if (!response.ok) throw new Error("Error al actualizar la contraseña");
      alert("Contraseña actualizada exitosamente");
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateData = async () => {
    try {
      const endpointMap = {
        cliente: `https://backend-integradora.vercel.app/api/clientes/${userDetails.idClientes}`,
        tecnico: `https://backend-integradora.vercel.app/api/tecnicos/${userDetails.idTecnicos}`,
      };
      const response = await fetch(endpointMap[rol], {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error al actualizar los datos");
      alert("Datos actualizados exitosamente");
      setUserData({ ...userData, ...formData });
      loadUserDetails(rol, iduser);
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 h-screen bg-[#eaeef6]">
        <Sidebar />
        <div className="flex-1">
          <div className="p-8 w-full h-screen flex justify-center items-center">
            <div className="max-w-md bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-center">
                <FaUser className="text-white text-4xl mb-2 mx-auto" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {rol === "admin" ? user.user : userDetails?.nombre}
                </h2>
                <p className="text-gray-200 text-sm">
                  {rol !== "admin" && userDetails?.CorreoElectronico}
                </p>
              </div>
              <div className="p-6">
                {rol !== "admin" && (
                  <>
                    <p className="text-gray-700 mb-4">
                      <strong>Apellidos:</strong> {userDetails?.ApellidoPa}{" "}
                      {userDetails?.ApellidoMa}
                    </p>
                    <p className="text-gray-700 mb-4">
                      <strong>Teléfono:</strong> {userDetails?.Telefono}
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
                  {rol !== "admin" && (
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
    </>
  );
}

export default SettingsPage;
