import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HomeIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
    { name: "Reportes", icon: DocumentChartBarIcon, href: "/reports" },
    { name: "Equipos", icon: PrinterIcon, href: "/printers " },
    { name: "Configuración", icon: Cog6ToothIcon, href: "/settings" },
  ];

  const isActiveRoute = (href) => pathname === href;

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
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
