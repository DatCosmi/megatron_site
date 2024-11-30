"use client";
import React, { createContext, useReducer, useEffect, useState } from "react";
import { authReducer } from "./UsuarioReducer";
import LoadingScreen from "../components/navigation/LoadingScreen";
import { useRouter } from "next/navigation";

export const authInitialState = {
  user: "",
  token: "",
  iduser: "",
  rol: "",
  userDetails: "",
};

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Función para validar el token almacenado
  const validateToken = async (tokenToValidate) => {
    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/auth/perfil`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenToValidate}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        return data; // Devolver los datos del perfil si el token es válido
      } else {
        console.error("validateToken: Token inválido", data); // Log de error
        throw new Error("Token inválido");
      }
    } catch (error) {
      console.error("validateToken: Error al validar el token", error); // Log de error
      return null; // Si ocurre un error, retornar null
    }
  };
  //Función para tener el token cargado en toda la app web
  const loadToken = async () => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    const storedRol = localStorage.getItem("rol");
    const storedIdUser = localStorage.getItem("iduser");

    if (storedToken && storedUser) {

      try {
        const tokenValidationResult = await validateToken(storedToken);

        if (tokenValidationResult) {
          const { usuario } = tokenValidationResult;

          // Almacenar los datos del usuario en localStorage para futuras referencias
          localStorage.setItem("rol", usuario.rol);
          localStorage.setItem("iduser", usuario.id.toString());
          localStorage.setItem("authUser", JSON.stringify(usuario));

          // Despachar la acción para actualizar el estado con los datos completos
          dispatch({
            type: "signIn",
            payload: {
              user: usuario,
              token: storedToken,
              rol: usuario.rol,
              iduser: usuario.id.toString(),
            },
          });

          // Aquí puedes cargar detalles adicionales si es necesario
          loadUserDetails(usuario.rol, usuario.id);
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          localStorage.removeItem("iduser");
          localStorage.removeItem("rol");

          // Despachar la acción de cierre de sesión
          dispatch({ type: "signOut" });
        }
      } catch (error) {
        console.error("loadToken: Error al validar el token:", error); // Log de error
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        localStorage.removeItem("iduser");
        localStorage.removeItem("rol");

        // Despachar la acción de cierre de sesión
        dispatch({ type: "signOut" });
      }
    } else {
      dispatch({ type: "signOut" });
    }

    setLoading(false); // Finaliza la carga una vez que la validación se haya completado
  };

  // El signIn también debe ser modificado para almacenar correctamente todos los valores
  const signIn = async (user, token) => {
    try {
      // Validamos el token primero
      const tokenValidationResult = await validateToken(token);
      if (tokenValidationResult) {
        const { usuario } = tokenValidationResult;

        // Almacenar los valores solo si el token es válido
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(usuario));
        localStorage.setItem("rol", usuario.rol);
        localStorage.setItem("iduser", usuario.id.toString());

        // Despachamos la acción para actualizar el estado
        dispatch({
          type: "signIn",
          payload: {
            user: usuario,
            token,
            rol: usuario.rol,
            iduser: usuario.id.toString(),
          },
        });

        // Cargar detalles adicionales del usuario si es necesario
        loadUserDetails(usuario.rol, usuario.id);
      } else {
        console.error("signIn: Token inválido"); // Log si el token es inválido
      }
    } catch (error) {
      console.error("signIn: Error al validar el token en signIn:", error); // Log de error
    }
  };

  // Cargar detalles del usuario según su rol
  const loadUserDetails = async () => {
    const { token, rol, iduser } = authState;
    if (token && rol && iduser) {
      try {
        const endpointMap = {
          cliente: `https://backend-integradora.vercel.app/api/clienteById/${iduser}`,
          tecnico: `https://backend-integradora.vercel.app/api/tecnicoById/${iduser}`,
          admin: `https://backend-integradora.vercel.app/api/auth/getUser/${iduser}`,
        };

        const endpoint = endpointMap[rol];

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const result = await response.json();

        if (result) {
        
          dispatch({
            type: "setUsuario",
            payload: { userDetails: result }, // Guarda todo el JSON recibido
          });
        }
      } catch (err) {
        console.error(
          "loadUserDetails: Error al obtener los detalles del usuario:",
          err.message
        ); // Log de error
      }
    } else {
   
    }
  };

  useEffect(() => {
    loadToken();
  }, []);
 //Cerrar sesión y eliminar datos necesarios para el funcionamiento de la app web
  const signOut = async () => {
    localStorage.clear();
    dispatch({ type: "signOut" });
    router.push("/");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <AuthContext.Provider
        value={{
          authState,
          signIn,
          signOut,
          loadUserDetails,
        }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};
