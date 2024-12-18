"use client";
import { useContext, useEffect, useState } from "react";
import ServiceDetailModal from "./SerciceDetailModal";
import { Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/UsuarioContext";
function TechnicianSidebar({ reports, technicians, setIsTechnicianListOpen }) {
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [localSelectedService, setLocalSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [technician, setTechnicians] = useState([]);
  const { authState } = useContext(AuthContext);
  const { token } = authState;
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

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleTechnicianClick = (technician) => {
    if (selectedTechnician?.idTecnicos === technician.idTecnicos) {
      setSelectedTechnician(null);
      setLocalSelectedService(null);
    } else {
      setSelectedTechnician(technician);
      setLocalSelectedService(null);
    }
  };

  const normalizeString = (str) => (str ? str.trim().toLowerCase() : "");

  const getTechnicianReports = (technician) => {
    const technicianFullName = normalizeString(
      `${technician.Nombre} ${technician.ApellidoPa} ${technician.ApellidoMa}`
    );

    return reports.filter(
      (report) =>
        normalizeString(report.TecnicoAsignado) === technicianFullName &&
        report.estado !== "concluido"
    );
  };

  const getNewReportsCount = () => {
    return reports.filter(
      (report) => !report.TecnicoAsignado || report.TecnicoAsignado === null
    ).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "border-pink-500";
      case "ejecucion":
        return "border-yellow-500";
      default:
        return "border-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return <AlertCircle className="w-5 h-5 text-pink-500" />;
      case "ejecucion":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  const openServiceModal = (report) => {
    setLocalSelectedService(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLocalSelectedService(null);
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
    <aside className="hidden hidden md:block w-1/6 h-screen sticky top-0 right-0 z-40 pb-10">
      <div className="h-screen flex flex-col gap-4 p-4">
        {/* Panel de Nuevos Reportes */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex flex-col items-center text-white space-y-2">
              <FileText className="w-12 h-12 mb-2" />
              <h3 className="text-xl font-semibold">Nuevos Reportes</h3>
              <p className="text-sm text-blue-100">Pendientes de asignar</p>
              <span className="text-4xl font-bold">{getNewReportsCount()}</span>
            </div>
          </div>
        </div>
        {/* Panel de Técnicos */}
        <div className="h-[100%] bg-white rounded-lg shadow-lg overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Técnicos</h2>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-1xl font-bold text-gray-400">
                  Cargando técnicos...
                </p>
              </div>
            ) : technicians.length > 0 ? (
              technicians.map((technician) => (
                <div key={technician.idTecnicos} className="space-y-4">
                  <button
                    onClick={() => handleTechnicianClick(technician)}
                    className={`w-full px-4 py-3 flex items-center justify-between rounded-lg border transition duration-200 ${
                      selectedTechnician?.idTecnicos === technician.idTecnicos
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">
                        {technician.Nombre} {technician.ApellidoPa}
                      </span>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full shadow-sm">
                      {getTechnicianReports(technician).length} reportes
                    </span>
                  </button>

                  {selectedTechnician?.idTecnicos === technician.idTecnicos && (
                    <div className="space-y-3 pl-4">
                      {getTechnicianReports(selectedTechnician).length > 0 ? (
                        getTechnicianReports(selectedTechnician).map(
                          (report) => (
                            <div
                              key={report.IdReporte}
                              onClick={() => openServiceModal(report)}
                              className={`cursor-pointer bg-white rounded-lg p-4 border-l-4 shadow-sm hover:shadow-md transition duration-200 ${getStatusColor(
                                report.estado
                              )}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {report.tituloReporte}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {report.nombreUbicacion}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {formatFechaHora(report.fechaCreacion)}
                                  </p>
                                </div>
                                <div className="ml-4">
                                  {getStatusIcon(report.estado)}
                                </div>
                              </div>
                              <div className="mt-4">
                                <button
                                  onClick={() => openServiceModal(report)}
                                  className="w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                  Ver Detalles
                                </button>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No hay reportes asignados
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-1xl font-bold text-gray-400">
                  No hay técnicos disponibles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && localSelectedService && (
          <ServiceDetailModal
            report={localSelectedService}
            closeModal={closeModal}
          />
        )}
      </div>
    </aside>
  );
}

export default TechnicianSidebar;
