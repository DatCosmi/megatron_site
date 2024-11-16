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
    // Render a spinner while determining authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return token ? children : null; // Render children if authenticated
};

export default ProtectedRoute;
