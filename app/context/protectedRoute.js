"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./UsuarioContext";
import { useRouter } from "next/navigation";
import LoadingScreen from "../components/navigation/LoadingScreen";

const ProtectedRoute = ({ children }) => {
  const { authState, signOut } = useContext(AuthContext);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateUserToken = async () => {
      if (!token) {
        // No hay token almacenado, redirigir al login
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://backend-integradora.vercel.app/api/auth/perfil`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // Si el token es inválido, cerrar sesión y redirigir al login
          signOut();
          router.push("/login");
          return;
        }

        // Si el token es válido, permitir el acceso
        setIsLoading(false);
      } catch (error) {
        console.error("Error al validar el token en ProtectedRoute:", error);
        signOut(); // Cerrar sesión en caso de error
        router.push("/login");
      }
    };

    validateUserToken();
  }, [token, router, signOut]);

  if (isLoading) {
    // Mostrar pantalla de carga mientras se valida el token
    return <LoadingScreen />;
  }

  // Si el token es válido, renderizar el contenido protegido
  return children;
};

export default ProtectedRoute;
