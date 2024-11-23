"use client";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "./UsuarioContext";
import { useRouter } from "next/navigation";
import LoadingScreen from "../components/navigation/LoadingScreen";

const ProtectedRoute = ({ children }) => {
  const { authState, signOut } = useContext(AuthContext);
  const { token } = authState;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      // Si no hay token, redirigir al login
      router.push("/login");
    }
  }, [token, router]);

  if (!token) {
    // Mientras se redirige, mostrar un loader o pantalla en blanco
    return <LoadingScreen />;
  }

  return children;
};

export default ProtectedRoute;
