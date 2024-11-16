// app/components/ProtectedRoute.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    // Check if token exists
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false); // Token exists, stop loading
    }
  }, [router, token]);

  if (isLoading) {
    // Render a loading state while determining authentication
    return <div>Cargando...</div>;
  }

  return token ? children : null; // Render   children if authenticated
};

export default ProtectedRoute;
