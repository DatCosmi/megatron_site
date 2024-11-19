"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar";
import TechnicianSidebar from "../components/dashboard/TechnicianSidebar";
import TechnicianModal from "../components/dashboard/TechnicianModal";
import AddReportModal from "../components/dashboard/AddReportModal";
import ServiceDetailModal from "../components/dashboard/SerciceDetailModal";
import { FILTERS } from "../data/constants";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  Users,
  Calendar,
  FileText,
} from "lucide-react";
import ProtectedRoute, { token } from "../components/protectedRoute";
import axios from "axios";
import { RoleProvider } from "../components/context/RoleContext";
import SearchBar from "../components/dashboard/SearchBar";

function Reports() {
  const [reports, setReports] = useState([]);
  const [reportToEdit, setReportToEdit] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isTechnicianListOpen, setIsTechnicianListOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [isReportDetailModalOpen, setIsReportDetailModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/reportesCreados",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/tecnicos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (IdReporte) => {
    const currentDate = new Date();
    const reportData = {
      estado: "concluido",
      fechaHoraActualizacion: currentDate,
    };

    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/reportes/${IdReporte}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al completar el reporte");
      }

      setSuccessMessage("Reporte completado exitosamente.");
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      console.error(error);
    }
    fetchReports();
  };

  const handleStart = async (IdReporte) => {
    const reportData = {
      estado: "ejecucion",
    };

    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/reportes/${IdReporte}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al completar el reporte");
      }

      setSuccessMessage("Reporte completado exitosamente.");
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      console.error(error);
    }
    fetchReports();
  };

  // Función para filtrar reportes por fecha y estado
  const getFilteredReports = (reportsData, filter) => {
    return reportsData.filter((report) => {
      const fechaActual = new Date();
      const fechaUltimaSemana = new Date(
        fechaActual.getTime() - 7 * 24 * 60 * 60 * 1000
      );
      const fechaReporte = new Date(report.fechaCreacion);

      // Primero filtrar por fecha
      const esReporteDentroDeUltimaSemana =
        fechaReporte >= fechaUltimaSemana && fechaReporte <= fechaActual;

      // Luego aplicar el filtro de estado
      const cumpleFiltroEstado =
        filter === "todos" ? true : report.estado === filter;

      return esReporteDentroDeUltimaSemana && cumpleFiltroEstado;
    });
  };

  // Estado para mantener los reportes filtrados por búsqueda
  const [searchFilteredReports, setSearchFilteredReports] = useState([]);

  // Actualizar los filtros cuando cambien los reportes o el filtro activo
  useEffect(() => {
    if (reports.length > 0) {
      const filteredByDateAndStatus = getFilteredReports(reports, activeFilter);
      setSearchFilteredReports(filteredByDateAndStatus);
    }
  }, [reports, activeFilter]);

  // Fetch initial data
  useEffect(() => {
    fetchReports();
    fetchTechnicians();
  }, []);

  const handleAssign = (reportId) => {
    setReportToEdit(reportId);
    setIsTechnicianListOpen(true);
  };

  const handleDelete = async (reportId) => {
    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/reportes/${reportId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchReports();
        console.log("si se pudo");
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return <AlertCircle className="w-6 h-6 text-[#ff006e]" />;
      case "ejecucion":
        return <Clock className="w-6 h-6 text-[#ffbe0b]" />;
      case "concluido":
        return <CheckCircle className="w-6 h-6 text-[#06d6a0]" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-[#ff006e]";
      case "ejecucion":
        return "bg-[#ffbe0b]";
      case "concluido":
        return "bg-[#06d6a0]";
      default:
        return "bg-gray-500";
    }
  };

  const closeModal = () => {
    setIsAddReportModalOpen(false);
    setIsTechnicianListOpen(false);
    setIsReportDetailModalOpen(false);
    fetchReports();
    setReportToEdit(null);
  };

  const formatFechaHora = (fecha) => {
    const fechaObj = new Date(fecha);
    const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };

    const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opcionesFecha);
    const horaFormateada = fechaObj.toLocaleTimeString("es-ES", opcionesHora);

    return `${fechaFormateada} a las ${horaFormateada}`;
  };

  return (
    <RoleProvider>
      <ProtectedRoute>
        <div className="flex min-h-screen bg-[#eaeef6]  ml-64">
          <Sidebar />

          <main className="flex-1 p-8 mr-72">
            <div className="max-w-7xl mx-auto">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Lista de Reportes
                  </h1>
                  <p className="text-sm text-gray-500">
                    Reportes realizados en el último mes
                  </p>
                </div>
                <SearchBar
                  reports={reports}
                  setFilteredReports={setSearchFilteredReports}
                  activeFilter={activeFilter}
                />
                <button
                  onClick={() => setIsAddReportModalOpen(true)}
                  className="p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors"
                >
                  <Plus className="w-7 h-7" />
                </button>
              </header>

              <div className="flex gap-4 mb-8">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter.id
                        ? "bg-[#2d57d1] text-white"
                        : "text-gray-600 bg-[#eaeef6] hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                    <span className="ml-2 text-xs">
                      {
                        reports.filter((s) =>
                          filter.id === "todos" ? true : s.estado === filter.id
                        ).length
                      }
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold text-gray-400">
                      Cargando reportes...
                    </p>
                  </div>
                ) : getFilteredReports.length > 0 ? (
                  searchFilteredReports.map((report) => (
                    <div
                      key={report.folioReporte}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex"
                    >
                      <div
                        className={`w-1 ${getStatusColor(report.estado)}`}
                      ></div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`p-2 rounded-xl ${getStatusColor(
                              report.estado
                            )} bg-opacity-10`}
                          >
                            {getStatusIcon(report.estado)}
                          </div>
                          <div>
                            <h2 className="font-semibold text-gray-800">
                              {report.tituloReporte}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {report.nombreUbicacion}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>{report.folioReporte}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>
                              {report.TecnicoAsignado || "Sin asignar"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatFechaHora(report.fechaCreacion)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            className="w-full px-4 py-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors text-sm font-medium"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsReportDetailModalOpen(true);
                            }}
                          >
                            Ver Detalles
                          </button>

                          {report.estado === "pendiente" &&
                            !report.TecnicoAsignado && (
                              <>
                                <button
                                  className="w-full px-4 py-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                  onClick={() => {
                                    handleAssign(report.IdReporte);
                                  }}
                                >
                                  Asignar
                                </button>
                              </>
                            )}

                          {report.estado === "pendiente" &&
                            report.TecnicoAsignado && (
                              <>
                                <button
                                  className="w-full px-4 py-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                  onClick={() => {
                                    handleAssign(report.IdReporte);
                                  }}
                                >
                                  Reasignar
                                </button>
                                <button
                                  className="w-full px-4 py-2 bg-[#ffbe0b] text-white rounded-lg hover:bg-[#edb20e] transition-colors text-sm font-medium"
                                  onClick={() => handleStart(report.IdReporte)}
                                >
                                  Comenzar
                                </button>
                              </>
                            )}

                          {report.estado === "ejecucion" && (
                            <>
                              <button
                                className="w-full px-4 py-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                onClick={() => {
                                  handleAssign(report.IdReporte);
                                }}
                              >
                                Reasignar
                              </button>
                              <button
                                className="w-full px-4 py-2 bg-[#35cd63] text-white rounded-lg hover:bg-[#28b552] transition-colors text-sm font-medium"
                                onClick={() => handleComplete(report.IdReporte)}
                              >
                                Completar
                              </button>
                            </>
                          )}

                          <button
                            className="w-full px-4 py-2 bg-[#f71b49] text-white rounded-lg hover:bg-[#df1f47] transition-colors text-sm font-medium"
                            onClick={() => handleDelete(report.IdReporte)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold text-gray-400">
                      No hay reportes
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isTechnicianListOpen && (
              <TechnicianModal
                reportToEdit={reportToEdit}
                setReports={setReports}
                closeModal={closeModal}
              />
            )}
            {isAddReportModalOpen && (
              <AddReportModal
                reports={reports}
                setReports={setReports}
                closeModal={closeModal}
              />
            )}
            {isReportDetailModalOpen && selectedReport && (
              <ServiceDetailModal
                report={selectedReport}
                closeModal={closeModal}
              />
            )}
          </main>

          <TechnicianSidebar
            reports={reports}
            technicians={technicians}
            setIsTechnicianListOpen={setIsTechnicianListOpen}
          />
        </div>
      </ProtectedRoute>
    </RoleProvider>
  );
}

export default Reports;
