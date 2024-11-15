"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/dashboard/sidebar";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Trash2,
  SquarePen,
} from "lucide-react";
import AddCliente from "../components/dashboard/AddCliente"; // Import as a component

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteToEdit, setClienteToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Initialize with an empty string
  const [IsAddclienteModalOpen, setIsAddclienteModalOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(clientes.length / itemsPerPage);

  const handleEditClick = (client) => {
    setClienteToEdit(client);
    setIsAddclienteModalOpen(true);
  };

  const closeModal = () => {
    setIsAddclienteModalOpen(false);
    fetchClientes();
    setClienteToEdit(null);
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/clienteusuarios"
      );
      setClientes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const getSortedClientes = () => {
    const filteredClientes = clientes.filter((cliente) =>
      cliente.Cliente.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!sortConfig.key) return filteredClientes;

    return filteredClientes.sort((a, b) => {
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

  const paginationRange = () => {
    const range = [];
    const delta = 2;
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage > 3) range.push("...");
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    if (currentPage < totalPages - 2) range.push("...");

    return [1, ...range, totalPages];
  };

  const sortedClientes = getSortedClientes();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedClientes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex h-screen bg-[#eff1f6] ml-60">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-[#eff1f6]">
        <div className="dashboard space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard de Clientes
          </h1>

          <div className="flex flex-col w-full bg-white rounded-lg p-4">
            <div className="flex gap-3 w-[1190px]">
              <div className="relative flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Qué estás buscando?
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o usuario"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="relative min-w-[100px] flex items-end">
                <button
                  onClick={() => setIsAddclienteModalOpen(true)}
                  className="p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-700">
                Clientes
              </span>
            </div>

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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 recent-orders">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo Electrónico
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="100%"
                      className="text-center py-4 text-gray-500"
                    >
                      Cargando productos...
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((cliente, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.Cliente}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.user}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.telefono}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.correoElectronico}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                        <button
                          onClick={() => handleEditClick(cliente)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <SquarePen className="h-4 w-4" />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="100%"
                      className="text-center py-4 text-gray-500"
                    >
                      No se encontraron resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {IsAddclienteModalOpen && (
        <AddCliente closeModal={closeModal} clienteToEdit={clienteToEdit} />
      )}
    </div>
  );
};

export default ClientesPage;
