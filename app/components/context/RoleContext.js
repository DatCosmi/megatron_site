// context/RoleContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { token } from "../protectedRoute";

// Crear el contexto
const RoleContext = createContext();

// Crear el proveedor del contexto
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const clearRole = () => {
    setRole(null);
    localStorage.removeItem("role"); // Limpiar también localStorage
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchPerfil = async () => {
    
    await delay(2);

    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/auth/perfil",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setRole(data.usuario.rol); // Actualizamos el rol en el estado
      localStorage.setItem("role", data.usuario.rol); // Guardar el rol en localStorage
    } catch (error) {
      console.error("Error fetching perfil:", error);
      setRole(null); // Si hay error, aseguramos que el rol sea null
    } finally {
      setIsLoading(false); // Cuando termine la carga
    }
  };

  useEffect(() => {
    // Verificar si el rol ya está en el localStorage
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      setIsLoading(false); // Si el rol ya está, no necesitamos hacer la solicitud
    } else {
      fetchPerfil(); // Si no hay rol, hacemos la solicitud a la API
    }
  }, []);

  // Si está cargando, podemos retornar un loading o null para evitar mostrar nada.
  if (isLoading) {
    return null; // O un componente de carga si lo prefieres
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
