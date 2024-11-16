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
import AddUbicModal from "../components/dashboard/AddUbicModal";
import ProtectedRoute from "../components/protectedRoute";

const Ubicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ubicacionToEdit, setUbicacionToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUbicModalOpen, setIsAddUbicModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(ubicaciones.length / itemsPerPage);

  const fetchUbicaciones = async () => {
    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/ubicacion"
      );
      setUbicaciones(response.data);
    } catch (error) {
      console.error("Error fetching ubicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUbicaciones();
  }, []);

  const handleDelete = async (ubicacionID) => {
    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/ubicacion/${ubicacionID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchUbicaciones();
      } else {
        console.error("Failed to delete ubicacion");
      }
    } catch (error) {
      console.error("Error deleting ubicacion:", error);
    }
  };

  const handleEditClick = (ubicacion) => {
    setUbicacionToEdit(ubicacion);
    setIsAddUbicModalOpen(true);
  };

  const closeModal = () => {
    setIsAddUbicModalOpen(false);
    fetchUbicaciones();
    setUbicacionToEdit(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getFilteredUbicaciones = () => {
    return ubicaciones.filter((ubicacion) =>
      ubicacion.Nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  const filteredUbicaciones = getFilteredUbicaciones();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredUbicaciones.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#eff1f6] ml-60">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-[#eff1f6]">
          <div className="dashboard space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-semibold text-gray-800">
              Dashboard de Ubicaciones
            </h1>

            {/* Filtros y búsqueda */}
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
                      placeholder="Buscar por nombre de ubicación"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="relative min-w-[100px] flex items-end">
                  <button
                    onClick={() => setIsAddUbicModalOpen(true)}
                    className="p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors flex items-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Table Header and Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700">
                  Ubicaciones
                </span>
              </div>

              {/* Pagination */}
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

            {/* Ubicaciones Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 recent-orders">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      scope="col"
                      className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ciudad
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código Postal
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
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
                        Cargando ubicaciones...
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((ubicacion) => (
                      <tr key={ubicacion.idUbicaciones}>
                        <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ubicacion.idUbicaciones}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {ubicacion.Nombre}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {ubicacion.Ciudad}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {ubicacion.Estado}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {ubicacion.CodigoPostal}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {ubicacion.Direccion}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-xs flex">
                          <button
                            onClick={() =>
                              handleDelete(ubicacion.idUbicaciones)
                            }
                            className="text-[#ff006e] flex"
                          >
                            <Trash2 />
                          </button>
                          <button
                            onClick={() => handleEditClick(ubicacion)}
                            className="text-[#007bff] flex"
                          >
                            <SquarePen />
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
                        No hay ubicaciones disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Add/Edit Ubicación */}
            {isAddUbicModalOpen && (
              <AddUbicModal
                ubicacionToEdit={ubicacionToEdit}
                closeModal={closeModal}
                setUbicaciones={setUbicaciones}
              />
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Ubicaciones;
