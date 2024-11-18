import React, { createContext, useContext, useState, useEffect } from "react";

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
    const tokenExp = localStorage.getItem("exp");

    if (storedRole && tokenExp) {
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

      if (currentTime < parseInt(tokenExp, 10)) {
        setRole(storedRole);
      } else {
        console.warn("Token expirado. Limpiando datos de sesión.");
        clearRole();
      }
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
