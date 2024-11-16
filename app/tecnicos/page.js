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
import AddTecnicoModal from "../components/dashboard/AddTecnico";
import ProtectedRoute, { token } from "../components/protectedRoute";
import { useRouter } from "next/navigation";

const TecnicosPage = () => {
  const router = useRouter();

  const [technicians, setTechnicians] = useState([]);
  const [technicianList, setTechnicianList] = useState(technicians);
  const [loading, setLoading] = useState(true);
  const [technicianToEdit, setTechnicianToEdit] = useState(null);
  const [role, setRole] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTechnicianModalOpen, setIsAddTechnicianModalOpen] =
    useState(false);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(technicians.length / itemsPerPage);

  const handleEditClick = (technician) => {
    setTechnicianToEdit(technician);
    setIsAddTechnicianModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsAddTechnicianModalOpen(false);
    fetchTechnicians();
    setTechnicianToEdit(null);
  };

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/tecnicosusuarios",
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      const data = response.data.map((technician) => ({
        ...technician,
      }));
      setTechnicians(data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch technicians from the backend
  useEffect(() => {
    const roleFromLocalStorage = localStorage.getItem("role");
    setRole(roleFromLocalStorage);

    if (roleFromLocalStorage !== "admin") {
      router.push("/NotAuthorized ");
    } else {
      fetchTechnicians();
    }
  }, [role, router]);

  // Function to handle delete action
  const handleDelete = async (technicianId, userId) => {
    try {
      // Call the backend API to delete the technician
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/tecnicos/${technicianId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        await fetch(
          `https://backend-integradora.vercel.app/api/auth/delete-user/${userId}`,
          {
            method: "DELETE",
          }
        );
        fetchTechnicians();
      } else {
        console.error("Failed to delete technician");
      }
    } catch (error) {
      console.error("Error deleting technician:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedTechnicians = () => {
    const filteredTechnicians = technicians.filter(
      (technician) =>
        (statusFilter === "" || technician.estatus === statusFilter) &&
        ((technician.Tecnico &&
          technician.Tecnico.toLowerCase().includes(
            searchQuery.toLowerCase()
          )) ||
          (technician.user &&
            technician.user.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    if (!sortConfig.key) return filteredTechnicians;

    return filteredTechnicians.sort((a, b) => {
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

  const sortedTechnicians = getSortedTechnicians();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedTechnicians.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#eff1f6] ml-60">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-[#eff1f6]">
          <div className="dashboard space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Dashboard de Técnicos
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

                <div className="relative min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estatus
                  </label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                <div className="relative min-w-[100px] flex items-end">
                  <button
                    onClick={() => setIsAddTechnicianModalOpen(true)}
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
                  Técnicos
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
                          : "bg-white text-gray-700 hover:bg-blue-100"
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

            <div className="overflow-hidden bg-white rounded-lg shadow-md mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("Tecnico")}
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("user")}
                    >
                      Usuario
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("Telefono")}
                    >
                      Teléfono
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("correoElectronico")}
                    >
                      Correo Electronico
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("estatus")}
                    >
                      Estatus
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        Cargando técnicos...
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((technician) => (
                      <tr key={technician.idTecnicos}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {technician.Tecnico}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {technician.user}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {technician.telefono}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {technician.correoElectronico}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {technician.estatus}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleEditClick(technician)}
                            className="text-blue-500 hover:text-blue-700 mr-3"
                          >
                            <SquarePen className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(
                                technician.idTecnicos,
                                technician.idusers
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        No se encontraron técnicos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isAddTechnicianModalOpen && (
            <AddTecnicoModal
              tecnicoToEdit={technicianToEdit}
              closeModal={closeModal}
              setTechnicians={setTechnicians}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default TecnicosPage;
