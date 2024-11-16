// app/components/ProtectedRoute.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false); // Token exists, stop loading
    }
  }, [router]);

  if (isLoading) {
    // Render a loading state while determining authentication
    return <div>Cargando...</div>;
  }

  return token ? children : null; // Render   children if authenticated
};

export default ProtectedRoute;
