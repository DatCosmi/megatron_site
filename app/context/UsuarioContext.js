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
};

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Función para validar el token almacenado
  const validateToken = async (tokenToValidate) => {
    console.log("validateToken: Iniciando validación del token"); // Log de entrada
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
        console.log("validateToken: Token válido"); // Log cuando el token es válido
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

  const loadToken = async () => {
    console.log("loadToken: Iniciando carga del token"); // Log de entrada
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    const storedRol = localStorage.getItem("rol");
    const storedIdUser = localStorage.getItem("iduser");

    if (storedToken && storedUser) {
      console.log("loadToken: Token y usuario encontrados en localStorage"); // Log si se encuentran en localStorage

      try {
        const tokenValidationResult = await validateToken(storedToken);

        if (tokenValidationResult) {
          const { usuario } = tokenValidationResult;

          // Almacenar los datos del usuario en localStorage para futuras referencias
          console.log("loadToken: Token válido, cargando datos del usuario"); // Log al cargar datos del usuario
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
          console.log("loadToken: Token inválido, cerrando sesión"); // Log si el token es inválido
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
      console.log("loadToken: No se encontró token o usuario, cerrando sesión"); // Log si no se encuentran en localStorage
      dispatch({ type: "signOut" });
    }

    setLoading(false); // Finaliza la carga una vez que la validación se haya completado
    console.log("loadToken: Carga completada"); // Log al finalizar carga
  };

  // El signIn también debe ser modificado para almacenar correctamente todos los valores
  const signIn = async (user, token) => {
    console.log("signIn: Iniciando proceso de inicio de sesión"); // Log de entrada
    try {
      // Validamos el token primero
      const tokenValidationResult = await validateToken(token);
      if (tokenValidationResult) {
        const { usuario } = tokenValidationResult;

        // Almacenar los valores solo si el token es válido
        console.log("signIn: Token válido, almacenando datos"); // Log al almacenar datos
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
    console.log("loadUserDetails: Cargando detalles del usuario"); // Log de entrada
    const { token, rol, iduser } = authState;
    if (token && rol && iduser) {
      try {
        const endpointMap = {
          cliente: `https://backend-integradora.vercel.app/api/clienteById/${iduser}`,
          tecnico: `https://backend-integradora.vercel.app/api/tecnicoById/${iduser}`,
          admin: `https://backend-integradora.vercel.app/api/auth/getUser/${iduser}`,
        };

        const endpoint = endpointMap[rol];
        console.log("loadUserDetails: Llamando a la API para", rol); // Log antes de hacer la petición

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
          console.log(
            "loadUserDetails: Detalles del usuario obtenidos",
            result
          ); // Log si obtenemos los detalles
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
      console.log(
        "loadUserDetails: No se encontraron datos de usuario o token"
      ); // Log si no hay datos
    }
  };

  useEffect(() => {
    console.log("useEffect: Iniciando carga de token al montar el componente"); // Log cuando se monta el componente
    loadToken();
  }, []);

  const signOut = async () => {
    console.log("signOut: Cerrando sesión"); // Log de entrada en signOut
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("iduser");
    localStorage.removeItem("rol");
    dispatch({ type: "signOut" });
    router.push("/");
  };

  if (loading) {
    console.log("LoadingScreen: Mostrando pantalla de carga"); // Log antes de renderizar el componente de carga
    return <LoadingScreen />;
  }

  return (
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
  );
};
