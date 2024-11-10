"use client";
import { TECHNICIANS, SERVICES } from "../../data/constants";
import { useState } from "react";
import ServiceDetailModal from "./SerciceDetailModal";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

function TechnicianSidebar({
  services,
  setSelectedService,
  setIsTechnicianListOpen,
}) {
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [localSelectedService, setLocalSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTechnicianClick = (technician) => {
    if (selectedTechnician?.id === technician.id) {
      setSelectedTechnician(null);
      setLocalSelectedService(null);
    } else {
      setSelectedTechnician(technician);
      setLocalSelectedService(null);
    }
  };

  const getTechnicianReports = (technicianName) => {
    return SERVICES.filter(
      (service) =>
        service.assignedTo === technicianName && service.status !== "completada"
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "border-pink-500";
      case "en_curso":
        return "border-emerald-500";
      case "sin_asignar":
        return "border-blue-500";
      default:
        return "border-yellow-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return <AlertCircle className="w-5 h-5 text-pink-500" />;
      case "en_curso":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const openServiceModal = (service) => {
    setLocalSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLocalSelectedService(null);
  };

  return (
    <aside className="w-80 bg-white p-6 border-l border-gray-200 h-screen fixed top-0 right-0 overflow-y-auto z-40">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Técnicos</h2>
        <button
          onClick={() => setIsTechnicianListOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {TECHNICIANS.map((technician) => (
          <div key={technician.id} className="space-y-4">
            <button
              onClick={() => handleTechnicianClick(technician)}
              className={`w-full px-4 py-3 flex items-center justify-between rounded-lg transition duration-200 ${
                selectedTechnician?.id === technician.id
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium">{technician.name}</span>
              </div>
              <span className="text-sm bg-white px-2 py-1 rounded-full shadow-sm">
                {getTechnicianReports(technician.name).length} reportes
              </span>
            </button>

            {selectedTechnician?.id === technician.id && (
              <div className="space-y-3">
                {getTechnicianReports(technician.name).length > 0 ? (
                  getTechnicianReports(technician.name).map((service) => (
                    <div
                      key={service.id}
                      onClick={() => openServiceModal(service)}
                      className={`cursor-pointer bg-white rounded-lg p-4 border-l-4 ${getStatusColor(
                        service.status
                      )} shadow-sm hover:shadow-md transition duration-200`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900">
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {service.department}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{service.date}</span>
                          </div>
                        </div>
                        <div>{getStatusIcon(service.status)}</div>
                      </div>
                      <div className="mt-2">
                        <button className="w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No hay reportes asignados
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && localSelectedService && (
        <ServiceDetailModal
          service={localSelectedService}
          closeModal={closeModal}
        />
      )}
    </aside>
  );
}

export default TechnicianSidebar;
