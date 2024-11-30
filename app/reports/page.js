"use client";
import { useEffect, useState, useContext, use } from "react";
import Sidebar from "../components/navigation/sidebar";
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
import axios from "axios";
import SearchBar from "../components/dashboard/SearchBar";
import { AuthContext } from "../context/UsuarioContext";
import ProtectedRoute from "../context/protectedRoute";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

function Reports() {
  const { authState, loadUserDetails } = useContext(AuthContext);
  const { rol, iduser, token, userDetails } = authState;

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshReports = async () => {
    setLoading(true);
    try {
      setIsRefreshing(true);
      // Resetea cualquier mensaje de error previo
      setError("");

      // Obtén los reportes basado en el rol del usuario
      const reportData = await LoadReportsDetails(clienteId, tecnicoId);

      // Actualiza el estado de reportes
      setReports(Array.isArray(reportData) ? reportData : []);

      // Opcional: Muestra un mensaje de éxito
      toast.success("Reportes actualizados");
    } catch (error) {
      console.error("Error al actualizar reportes:", error);
      toast.error("No se pudieron actualizar los reportes");
      setError("No se pudieron cargar los reportes");
    } finally {
      setIsRefreshing(false);
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
        throw new Error("Error al concluir el reporte");
      }

      setSuccessMessage("Servicio concluido exitosamente.");
      toast.success("Servicio concluido exitosamente");
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      console.error(error);
      toast.error("No se pudo concluir el servicio");
    }
    try {
      const updatedReports = await LoadReportsDetails(clienteId, tecnicoId);
      setReports(updatedReports);
    } catch (error) {
      console.error("Error actualizando reportes:", error);
    }
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
        throw new Error("Error al comenzar el servicio");
      }

      setSuccessMessage("Servicio comenzado exitosamente.");
      toast.success("Servicio comenzado exitosamente");
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      console.error(error);
      toast.error("No se pudo comenzar el servicio");
    }
    try {
      const updatedReports = await LoadReportsDetails(clienteId, tecnicoId);
      setReports(updatedReports);
    } catch (error) {
      console.error("Error actualizando reportes:", error);
    }
  };
  // Función para filtrar reportes por fecha y estado
  const getFilteredReports = (reportsData, filter) => {
    return reportsData.filter((report) => {
      const fechaActual = new Date();
      const fechaUltimaSemana = new Date(
        fechaActual.getTime() - 31 * 24 * 60 * 60 * 1000
      );
      const fechaReporte = new Date(report.fechaCreacion);

      // Primero filtrar por fecha
      const esReporteDentroDeUltimaSemana =
        fechaReporte >= fechaUltimaSemana && fechaReporte <= fechaActual;

      // Luego aplicar el filtro de estado
      const cumpleFiltroEstado =
        filter === "todos" ? true : report.estado === filter;

      // Filtro adicional para los reportes no asignados

      return esReporteDentroDeUltimaSemana && cumpleFiltroEstado;
    });
  };

  // Estado para mantener los reportes filtrados por búsqueda
  const [searchFilteredReports, setSearchFilteredReports] = useState([]);

  useEffect(() => {
    if (rol && iduser) {
      loadUserDetails(rol, iduser); // Solo depende de `rol` y `iduser`.
    }
  }, [iduser, rol]);
  // Actualizar los filtros cuando cambien los reportes o el filtro activo
  useEffect(() => {
    if (reports.length > 0) {
      const filteredByDateAndStatus = getFilteredReports(reports, activeFilter);
      setSearchFilteredReports(filteredByDateAndStatus);
    }
  }, [reports, activeFilter]);

  let clienteId = null;
  let tecnicoId = null;
  if (rol === "cliente" && userDetails) {
    clienteId = userDetails.idClientes;
  } else if (rol === "tecnico" && userDetails) {
    tecnicoId = userDetails.idTecnicos;
  }
  const initializeDashboard = async () => {
    setLoading(true);
    setError(null);

    const reportData = await LoadReportsDetails(clienteId, tecnicoId);
    setReports(Array.isArray(reportData) ? reportData : []);
  };
  useEffect(() => {
    if (userDetails) {
      initializeDashboard();
    }
  }, [userDetails]);

  // Fetch initial data
  useEffect(() => {
    fetchTechnicians();
  }, [reports]);

  const handleAssign = (reportId) => {
    setReportToEdit(reportId);
    setIsTechnicianListOpen(true);
  };

  const LoadReportsDetails = async (clienteId, tecnicoId) => {
    try {
      const endpointReportMap = {
        admin: `https://backend-integradora.vercel.app/api/reportesCreados`,
        cliente: `https://backend-integradora.vercel.app/api/reportesclientes/${clienteId}`,
        tecnico: `https://backend-integradora.vercel.app/api/tecnicosreportes/${tecnicoId}`,
      };

      const endpointReport = endpointReportMap[rol];
      const response = await fetch(endpointReport, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const result = await response.json();
      return result; // Retorna directamente los datos
    } catch (err) {
      console.error(
        "Reports: Error al obtener los detalles de los reportes:",
        err.message
      );
      return []; // Retorna un array vacío en caso de error
    }
  };

  const handleDelete = async (reportId) => {
    try {
      // Muestra la alerta de confirmación
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Confirmación de Eliminación
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  ¿Estás seguro de que deseas eliminar este reporte? Esta acción
                  no se puede deshacer.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={async () => {
                toast.dismiss(t.id); // Cierra el toast
                try {
                  // Realiza la solicitud DELETE
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
                    setReports((prevReportes) =>
                      prevReportes.filter(
                        (report) => report.IdReporte !== reportId
                      )
                    );
                    await LoadReportsDetails();
                    toast.success("Reporte eliminado exitosamente");
                  } else {
                    console.error("Falló la eliminación del reporte");
                    toast.error("No se pudo eliminar el reporte");
                  }
                } catch (error) {
                  console.error("Error al eliminar el reporte:", error);
                  toast.error("Error al procesar la solicitud");
                }
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Confirmar
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      ));
    } catch (error) {
      console.error("Error en la función handleDelete:", error);
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

  const closeModal = async () => {
    setIsAddReportModalOpen(false);
    setIsTechnicianListOpen(false);
    setIsReportDetailModalOpen(false);

    try {
      // Obtiene directamente los nuevos reportes
      const updatedReports = await LoadReportsDetails(clienteId, tecnicoId);
      setReports(updatedReports);
    } catch (error) {
      console.error("Error actualizando reportes:", error);
    }

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
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row gap-2 min-h-screen bg-[#eaeef6]">
        <Sidebar />

        <main className="p-6 pr-2 flex-1">
          <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Lista de Reportes
                </h1>
                <p className="text-sm text-gray-500">
                  Reportes realizados en la última semana
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
              {/* Botón de actualización */}
              <button
                onClick={refreshReports}
                disabled={isRefreshing}
                className={`p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors 
            flex items-center gap-2 
            ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <RefreshCw
                  className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center h-full min-h-[300px]">
                  <p className="text-2xl font-bold text-gray-400">
                    Cargando reportes...
                  </p>
                </div>
              ) : reports.length === 0 ? (
                <div className="col-span-full flex items-center justify-center h-full min-h-[300px]">
                  <p className="text-2xl font-bold text-gray-400">
                    No hay reportes registrados
                  </p>
                </div>
              ) : searchFilteredReports.length > 0 ? (
                searchFilteredReports.map((report) => (
                  <div
                    key={report.IdReporte}
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
                          <span>{report.folioReporte || "No disponible"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {report.TecnicoAsignado ||
                              report.tecnicoAsignado ||
                              report.nombreTecnico ||
                              "Sin asignar"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatFechaHora(report.fechaCreacion)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          className="w-full p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors text-sm font-medium"
                          onClick={() => {
                            setSelectedReport(report);
                            setIsReportDetailModalOpen(true);
                          }}
                        >
                          Ver Detalles
                        </button>

                        {report.estado === "pendiente" &&
                          rol === "admin" &&
                          !report.TecnicoAsignado && (
                            <>
                              <button
                                className="w-full p-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                onClick={() => {
                                  handleAssign(report.IdReporte);
                                }}
                              >
                                Asignar
                              </button>
                            </>
                          )}

                        {report.estado === "pendiente" &&
                          rol === "admin" &&
                          report.TecnicoAsignado && (
                            <>
                              <button
                                className="w-full p-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                onClick={() => {
                                  handleAssign(report.IdReporte);
                                }}
                              >
                                Reasignar
                              </button>
                              <button
                                className="w-full p-2 bg-[#ffbe0b] text-white rounded-lg hover:bg-[#edb20e] transition-colors text-sm font-medium"
                                onClick={() => handleStart(report.IdReporte)}
                              >
                                Comenzar
                              </button>
                            </>
                          )}

                        {report.estado === "pendiente" && rol === "tecnico" && (
                          <button
                            className="w-full p-2 bg-[#ffbe0b] text-white rounded-lg hover:bg-[#edb20e] transition-colors text-sm font-medium"
                            onClick={() => handleStart(report.IdReporte)}
                          >
                            Comenzar servicio
                          </button>
                        )}

                        {report.estado === "ejecucion" && rol === "admin" && (
                          <>
                            <button
                              className="w-full p-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                              onClick={() => {
                                handleAssign(report.IdReporte);
                              }}
                            >
                              Reasignar
                            </button>
                            <button
                              className="w-full p-2 bg-[#35cd63] text-white rounded-lg hover:bg-[#28b552] transition-colors text-sm font-medium"
                              onClick={() => handleComplete(report.IdReporte)}
                            >
                              Concluir servicio
                            </button>
                          </>
                        )}

                        {report.estado === "ejecucion" && rol === "tecnico" && (
                          <button
                            className="w-full p-2 bg-[#35cd63] text-white rounded-lg hover:bg-[#28b552] transition-colors text-sm font-medium"
                            onClick={() => handleComplete(report.IdReporte)}
                          >
                            Concluir servicio
                          </button>
                        )}

                        {(rol === "admin" || rol === "cliente") && (
                          <button
                            className="w-full p-2 bg-[#f71b49] text-white rounded-lg hover:bg-[#df1f47] transition-colors text-sm font-medium"
                            onClick={() => handleDelete(report.IdReporte)}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-full min-h-[300px]">
                  <p className="text-2xl font-bold text-gray-400">
                    No se encontraron reportes con los filtros aplicados
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
              LoadReportsDetails={LoadReportsDetails}
              id={clienteId}
              reports={reports}
              role={rol}
              setReports={setReports}
              closeModal={closeModal}
            />
          )}
          {isReportDetailModalOpen && selectedReport && (
            <ServiceDetailModal
              report={selectedReport}
              closeModal={closeModal}
              rol={rol}
            />
          )}
        </main>

        {rol === "admin" && (
          <TechnicianSidebar
            reports={reports}
            technicians={technicians}
            setIsTechnicianListOpen={setIsTechnicianListOpen}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default Reports;
