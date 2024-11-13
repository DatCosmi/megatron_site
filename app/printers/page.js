"use client";
import React, { useState } from "react";
import { PRINTERS } from "../data/constants";
import Sidebar from "../components/dashboard/sidebar";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";
import AddPrinterModal from "../components/dashboard/AddPrinterModal";

const Printers = () => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPrinterModalOpen, setIsAddPrinterModalOpen] = useState(false);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(PRINTERS.length / itemsPerPage);

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Cálculo de los elementos de paginación
  const paginationRange = () => {
    const range = [];
    const delta = 2; // Número de páginas cercanas a mostrar
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage > 3) range.push("...");
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    if (currentPage < totalPages - 2) range.push("...");

    return [1, ...range, totalPages];
  };

  const sortedPrinters = getSortedPrinters();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedPrinters.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex h-screen bg-[#eff1f6] ml-60">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-[#eff1f6]">
        <div className="dashboard space-y-6">
          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard de Equipos
          </h1>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col w-full bg-white rounded-lg p-4">
            <div className="flex gap-3 w-[1190px]">
              {/* Search Input with Label */}
              <div className="relative flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Qué estás buscando?
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por modelo o número de serie"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="relative min-w-[140px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    <option value="Multifuncional">Multifuncional</option>
                    <option value="Laser">Laser</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="relative min-w-[140px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="Activo">Activo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <div className="relative min-w-[100px] flex items-end">
                <button
                  onClick={() => setIsAddPrinterModalOpen(true)}
                  className="p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Header de tabla y controles */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-700">
                Equipos
              </span>
            </div>

            {/* Paginación */}
            <div className="pagination flex items-center space-x-2 bg-white p-2 rounded-md shadow">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {paginationRange().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 text-sm rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabla de Equipos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 recent-orders">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("model")}
                  >
                    Modelo
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("serialNumber")}
                  >
                    Número de Serie
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    Categoría
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((printer) => (
                  <tr key={printer.id} className="hover:bg-gray-50">
                    <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {printer.id}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {printer.model}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {printer.serialNumber}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {printer.category}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
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

        {/* Modal para añadir impresoras */}
        {isAddPrinterModalOpen && (
          <AddPrinterModal closeModal={() => setIsAddPrinterModalOpen(false)} />
        )}
      </main>
    </div>
  );
};

export default Printers;
