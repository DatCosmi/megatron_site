"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HomeIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PrinterIcon,
  MapPinIcon,
  ArchiveBoxIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "../context/RoleContext"; // Usamos el contexto

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { role, clearRole } = useRole(); // Accedemos al rol desde el contexto

  if (role === null) {
    clearRole();
    return <div></div>; // Puedes mostrar un loading mientras se carga el rol
  }
  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
    { name: "Reportes", icon: DocumentChartBarIcon, href: "/reports" },
    { name: "Equipos", icon: PrinterIcon, href: "/equipos" },
    { name: "Productos", icon: ArchiveBoxIcon, href: "/products" },
    { name: "Ubicaciones", icon: MapPinIcon, href: "/ubicaciones" },
    ...(role === "admin" && role !== "cliente" && role !== "tecnico"
      ? [
          { name: "Clientes", icon: UserIcon, href: "/clientes" },
          { name: "Técnicos", icon: WrenchScrewdriverIcon, href: "/tecnicos" },
        ]
      : []),
    { name: "Configuración", icon: Cog6ToothIcon, href: "/settings" },
  ];

  const isActiveRoute = (href) => pathname === href;

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearRole();
    router.push("/");
  };

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col h-screen fixed top-0 left-0 overflow-y-auto">
      {/* Logo section */}
      <div className="p-6 flex justify-center items-center">
        <Link href="/dashboard" className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 px-3 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2 mt-2 rounded-lg transition-colors duration-200
              ${
                isActiveRoute(item.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-[#757e96] hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="text-sm font-semibold">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout section */}
      <div className="p-4 border-t border-gray-200">
        <button
          className="flex items-center px-3 py-2 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
          onClick={() => handleLogout()}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
