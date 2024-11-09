"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PhoneIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isProductDetailPage =
      pathname.startsWith("/productos/") && pathname.length > 11;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 20 || isProductDetailPage;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Llama inmediatamente para establecer el estado si ya estás en `/productos/[id]`

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isRouteActive = (route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  };

  return (
    <header
      className={`
        fixed top-0 w-full z-50 transition-all duration-300 ease-in-out
        ${scrolled ? "h-14 border-b border-gray-200 bg-white" : "h-20 "}
      `}
    >
      <nav className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-full">
          <Link
            href="/"
            className={`transition-all duration-300 ease-in-out ${
              scrolled ? "scale-90" : "scale-100"
            }`}
          >
            <img
              src={`${scrolled ? "/logo.png" : "logo-blanco.png"}`}
              alt="Megatron"
              className={`w-auto hover:opacity-80 transition-opacity logo ${
                scrolled ? "logo" : "logo2"
              }`}
            />
          </Link>

          <div className="border-l-2 border-gray-500 h-0 mx-4"></div>

          <div className="flex h-full">
            {["/", "/servicios", "/contacto", "/productos"].map(
              (route, index) => {
                const routeNames = [
                  "INICIO",
                  "SERVICIOS",
                  "CONTACTO",
                  "PRODUCTOS",
                ];
                const isActive = isRouteActive(route);

                return (
                  <Link
                    key={route}
                    href={route}
                    className={`
            relative flex items-center h-full px-5
            ${scrolled ? "hover:bg-blue-50" : "hover:bg-blue-600"}
            ${
              isActive && scrolled
                ? "text-blue-700"
                : scrolled
                ? "text-gray-700"
                : "text-white"
            }
            transition-colors duration-200
          `}
                  >
                    <span className="text-xs font-bold">
                      {routeNames[index]}
                    </span>
                    {isActive && (
                      <div
                        className={`absolute left-0 w-full h-1 barrita ${
                          scrolled ? "bg-blue-700" : "bg-white"
                        }`}
                      ></div>
                    )}
                  </Link>
                );
              }
            )}
          </div>

          <div className="flex-grow"></div>

          {/* Botón Teléfono */}
          <button
            className={`
              px-6 py-2 rounded-full
              transform hover:scale-105
              transition-all duration-300 ease-in-out
              shadow-md hover:shadow-lg
              flex items-center space-x-2
              text-sm font-bold
              ${
                scrolled
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-white text-blue-700 hover:bg-blue-100"
              }
            `}
          >
            <PhoneIcon className="w-4 h-4" />
            <span>Tel: 618-825-3884</span>
          </button>

          {/* Botón Iniciar Sesión */}
          <Link
            href="/login"
            className={`
              ml-4 px-6 py-2 rounded-full
              transform hover:scale-105
              transition-all duration-300 ease-in-out
              shadow-md hover:shadow-lg
              flex items-center space-x-2
              text-sm font-bold
              ${
                scrolled
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-white text-blue-700 hover:bg-blue-100"
              }
            `}
          >
            <span>Iniciar sesión</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
