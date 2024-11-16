"use client"

import { useRouter } from "next/navigation";

const NotAuthorized = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Acceso Denegado
        </h1>
        <p className="mb-6">No tienes permiso para acceder a esta página.</p>
        <button
          onClick={handleGoBack}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Regresar a la página principal
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
