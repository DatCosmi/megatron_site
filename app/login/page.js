"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LoginPage = () => {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleGoHome = () => {
    router.push("/"); // Navega a la página principal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 flex justify-center items-center">
      {/* Contenedor Principal */}
      <div className="flex rounded-3xl overflow-hidden shadow-lg w-full max-w-6xl min-h-[80vh]">
        {/* Sección izquierda: Fondo blanco con login */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 bg-white p-8 flex flex-col justify-center items-center relative"
        >
          {/* Botón para regresar a la página principal */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoHome}
            className="absolute top-4 left-4 flex items-center text-blue-600 bg-transparent border-none cursor-pointer font-semibold text-sm"
          >
            {/* Ícono de flecha hacia la izquierda */}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Regresar a Inicio
          </motion.button>

          <div className="max-w-md w-full space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-blue-600">
                INICIO DE SESIÓN
              </h1>
              <p className="text-gray-500 mt-4">
                Inicia sesión para acceder al sistema.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Usuario"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Contraseña"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-semibold shadow-lg"
              >
                Iniciar Sesión
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        {/* Sección derecha: Imagen de fondo y logo blanco */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-1/2 relative flex flex-col items-center justify-center text-white p-12"
        >
          {/* Imagen de fondo */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/printer-bg.jpg"
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="z-0 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 mix-blend-multiply opacity-90" />
          </div>

          {/* Texto y logo */}
          <div className="relative z-10 text-center">
            <Image
              src="/logo-blanco.png"
              alt="White Logo"
              width={300}
              height={75}
              className="mb-8 mx-auto"
            />
            <p className="text-lg max-w-md mx-auto">
              Para cualquier duda o aclaración, contacta con nuestro equipo de
              trabajo. ¡Estamos para servirte!
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="tel:+1234567890"
              className="mt-4 inline-block py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors"
            >
              Tel: 618-825-3884
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
