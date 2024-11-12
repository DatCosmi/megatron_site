"use client";
import React, { useState } from "react";
import { PRINTERS } from "../data/constants";
import Sidebar from "../components/dashboard/sidebar";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import AddPrinterModal from "../components/dashboard/AddPrinterModal"; // Importa el modal de añadir impresora

const Printers = () => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPrinterModalOpen, setIsAddPrinterModalOpen] = useState(false); // Estado para el modal

  const getStatusBadge = (status) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "Activo":
        return `${baseClasses} bg-emerald-50 text-[#06d6a0] border border-emerald-200`;
      case "Mantenimiento":
        return `${baseClasses} bg-amber-50 text-[#ffbe0b] border border-amber-200`;
      case "Inactivo":
        return `${baseClasses} bg-red-50 text-[#ff006e] border border-red-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-800 border border-gray-200`;
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedPrinters = () => {
    const filteredPrinters = PRINTERS.filter(
      (printer) =>
        (categoryFilter === "" || printer.category === categoryFilter) &&
        (statusFilter === "" || printer.status === statusFilter) &&
        (printer.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          printer.serialNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );

    if (!sortConfig.key) return filteredPrinters;

    return filteredPrinters.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 text-gray-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-gray-600" />
    );
  };

  return (
    <div className="flex h-screen bg-[#eff1f6] ml-60">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-[#eff1f6]">
        <div className="dashboard">
          <h1 className="title font-semibold text-gray-800">
            Dashboard de Equipos
          </h1>

          {/* Filtros y búsqueda */}
          <div className="filters flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Buscar por modelo o número de serie"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input p-2 border rounded-md"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select p-2 border rounded-md"
            >
              <option value="">Todas las Categorías</option>
              <option value="Multifuncional">Multifuncional</option>
              <option value="Laser">Laser</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select p-2 border rounded-md"
            >
              <option value="">Todos los Estados</option>
              <option value="Activo">Activo</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <button
              onClick={() => setIsAddPrinterModalOpen(true)} // Abre el modal al hacer clic
              className="p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Tabla de Órdenes */}
          <div className="bg-white rounded-lg shadow overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 recent-orders">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-2">
                      ID
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("model")}
                  >
                    <div className="flex items-center gap-2">
                      Modelo
                      {getSortIcon("model")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("serialNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Número de Serie
                      {getSortIcon("serialNumber")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-2">
                      Categoría
                      {getSortIcon("category")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Estado
                      {getSortIcon("status")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedPrinters().map((printer) => (
                  <tr key={printer.id} className="hover:bg-gray-50">
                    <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      #{printer.id}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {printer.model}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {printer.serialNumber}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {printer.category}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(printer.status)}>
                        {printer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isAddPrinterModalOpen && (
        <AddPrinterModal closeModal={() => setIsAddPrinterModalOpen(false)} />
      )}
    </div>
  );
};

export default Printers;
