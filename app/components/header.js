"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
      fixed top-0 w-full bg-white z-50 transition-all duration-300 ease-in-out
      ${scrolled ? "py-2 shadow-md" : "py-4 shadow-sm"}
    `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className={`transition-all duration-300 ${
                scrolled ? "scale-90" : "scale-100"
              }`}
            >
              <img
                src="/logo.png"
                alt="Megatron"
                className="h-12 w-auto hover:opacity-80 transition-opacity logo"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Inicio</span>
            </Link>

            <Link
              href="/servicios"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <WrenchScrewdriverIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Servicios</span>
            </Link>

            <Link
              href="/contacto"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <PhoneIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Contacto</span>
            </Link>

            <Link
              href="/tienda"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <ShoppingCartIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Tienda</span>
            </Link>

            <button
              className="
              bg-blue-600 text-white px-6 py-2 rounded-full
              hover:bg-blue-700 transform hover:scale-105
              transition-all duration-300 ease-in-out
              shadow-md hover:shadow-lg
              flex items-center space-x-2
            "
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Tel: 618-825-3884</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
