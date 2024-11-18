import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Crear el contexto
const RoleContext = createContext();

// Crear el proveedor del contexto
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearRole = () => {
    setRole(null);
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("exp");
  };



  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    if (storedRole) {
      setRole(storedRole);
    } else {
      clearRole();
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
