// components/Sidebar.js
"use client";
import Link from "next/link";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid"; // Importación actualizada para Heroicons v2

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 font-bold text-lg">Megatron</div>
      <nav className="mt-4 flex-1">
        <Link
          href="/dashboard"
          className="flex items-center px-4 py-3 hover:bg-gray-700"
        >
          <HomeIcon className="w-5 h-5 mr-3" />
          Dashboard
        </Link>
        <Link
          href="/reports"
          className="flex items-center px-4 py-3 hover:bg-gray-700"
        >
          <ClipboardDocumentListIcon className="w-5 h-5 mr-3" />
          Reportes
        </Link>
        <Link
          href="/settings"
          className="flex items-center px-4 py-3 hover:bg-gray-700"
        >
          <Cog6ToothIcon className="w-5 h-5 mr-3" />
          Configuración
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
