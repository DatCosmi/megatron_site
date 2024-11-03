"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Users, Building2, Palmtree } from "lucide-react";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="font-sans">
      {/* Navigation - now sticky and responsive to scroll */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-2 bg-white shadow-md" : "py-4 bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <span
              className={`font-bold text-blue-600 transition-all duration-300 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
            >
              Megatron
            </span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600">
              Inicio
            </a>
            <a href="#" className="text-gray-600">
              Servicios
            </a>
            <a href="#" className="text-gray-600">
              Contacto
            </a>
            <a href="#" className="text-gray-600">
              Tienda
            </a>
          </div>
          <button
            className={`bg-blue-500 text-white rounded transition-all duration-300 ${
              isScrolled ? "px-3 py-1 text-sm" : "px-4 py-2 text-base"
            }`}
          >
            Register Now →
          </button>
        </div>
      </nav>

      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
};

export default NavBar;
