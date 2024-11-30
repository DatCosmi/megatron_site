"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../context/UsuarioContext";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { authState } = useContext(AuthContext);
  const { rol } = authState;
  const { signOut } = useContext(AuthContext);
  const menuItems = [
    { name: "Inicio", icon: HomeIcon, href: "/dashboard" },
    { name: "Reportes", icon: DocumentChartBarIcon, href: "/reports" },
    { name: "Equipos", icon: PrinterIcon, href: "/equipos" },
    { name: "Ubicaciones", icon: MapPinIcon, href: "/ubicaciones" },
    ...(rol === "admin" && rol !== "cliente" && rol !== "tecnico"
      ? [
          { name: "Productos", icon: ArchiveBoxIcon, href: "/products" },
          { name: "Clientes", icon: UserIcon, href: "/clientes" },
          { name: "Técnicos", icon: WrenchScrewdriverIcon, href: "/tecnicos" },
        ]
      : []),
    { name: "Configuración", icon: Cog6ToothIcon, href: "/settings" },
  ];

  const isActiveRoute = (href) => pathname === href;

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <aside className="h-screen bg-white hidden md:block w-60 sticky top-0 left-0 overflow-y-auto shadow-lg">
      <div className="h-[100%] flex flex-col">
        {/* Logo section */}
        <div className="p-2 flex justify-center items-center gap-2 border-b border-gray-[#898f9f]">
          <Link href="/dashboard" className="flex justify-center">
            <Image src="/logo.png" alt="Logo" width={110} height={110} />
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
                  ? "bg-[#ecf1ff] text-blue-600"
                  : "text-[#898f9f] hover:bg-[#ecf1ff] hover:text-blue-600"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout section */}
        <div className="flex-1 p-4 w-[100%] border-t border-gray-[#898f9f] sticky bottom-0 right-0 max-h-20">
          <button
            className="w-[100%] flex items-center px-3 py-2 text-[#898f9f] rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            onClick={() => handleLogout()}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            <span className="text-sm font-semibold">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
