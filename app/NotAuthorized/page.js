"use client";

import { useRouter } from "next/navigation";

const NotAuthorized = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8 border-t-4 border-red-500">
        <h1 className="text-4xl font-extrabold text-red-600 mb-6 text-center">
          Acceso Denegado
        </h1>
        <p className="text-gray-700 text-lg mb-8 text-center">
          No tienes permiso para acceder a esta página. Si crees que esto es un
          error, contacta al administrador.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Regresar a la página principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
