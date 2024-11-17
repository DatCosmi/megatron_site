// context/RoleContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Crear el contexto
const RoleContext = createContext();

// Crear el proveedor del contexto
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const clearRole = () => {
    setRole(null);
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchPerfil = async (storedToken) => {

    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/auth/perfil",
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = response.data;
      setRole(data.usuario.rol); // Actualizamos el rol en el estado
      localStorage.setItem("role", data.usuario.rol);
      localStorage.setItem("id", data.usuario.id); // Guardar el rol en localStorage
    } catch (error) {
      console.error("Error fetching perfil:", error);

      setRole(null); // Si hay error, aseguramos que el rol sea null
    } finally {
      setIsLoading(false); // Cuando termine la carga
    }
  };

  useEffect(() => {
    // Verificar si el rol ya está en el localStorage
    const storedToken = localStorage.getItem("token");

    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    setIsLoading(false); // Si el rol ya está, no necesitamos hacer la solicitud
    fetchPerfil(storedToken); // Si no hay rol, hacemos la solicitud a la API
  }, []);

  // Si está cargando, podemos retornar un loading o null para evitar mostrar nada.
  if (isLoading) {
    <div className="flex items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useRole = () => {
  return useContext(RoleContext);
};
