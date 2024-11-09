// app/components/dashboard/TechnicianSidebar.js
"use client";
import { TECHNICIANS, SERVICES } from "../../data/constants";
import { useState } from "react";
import ServiceDetailModal from "./SerciceDetailModal"; // Importar el modal

function TechnicianSidebar({
  services,
  setSelectedService, // Prop que viene del componente padre
  setIsTechnicianListOpen,
}) {
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [localSelectedService, setLocalSelectedService] = useState(null); // Renombrado para evitar conflicto
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTechnicianClick = (technician) => {
    // Si el técnico ya está seleccionado, deseleccionarlo
    if (selectedTechnician?.id === technician.id) {
      setSelectedTechnician(null);
      setLocalSelectedService(null); // Limpiar servicio seleccionado si se cambia el técnico
    } else {
      setSelectedTechnician(technician);
      setLocalSelectedService(null); // Limpiar servicio seleccionado si se cambia el técnico
    }
  };

  // Filtrar los reportes asociados a un técnico en base a assignedTo
  // y que no estén marcados como "completada"
  const getTechnicianReports = (technicianName) => {
    return SERVICES.filter(
      (service) =>
        service.assignedTo === technicianName && service.status !== "completada"
    );
  };

  // Abrir el modal con los detalles del servicio
  const openServiceModal = (service) => {
    setLocalSelectedService(service); // Usar el estado local
    setIsModalOpen(true); // Abrir el modal
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setLocalSelectedService(null);
  };

  return (
    <aside className="w-64 bg-white p-4 border-l border-gray-200 h-screen fixed top-0 right-0">
      <h2 className="text-lg font-semibold mb-4">Técnicos</h2>
      <div className="overflow-y-auto h-full">
        {TECHNICIANS.map((technician) => (
          <div key={technician.id} className="relative">
            <button
              onClick={() => handleTechnicianClick(technician)}
              className={`w-full px-4 py-2 text-left rounded-lg ${
                selectedTechnician?.id === technician.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              } hover:bg-blue-200 transition duration-200`}
            >
              {technician.name}
            </button>

            {/* Mostrar los reportes asignados al técnico si está seleccionado */}
            {selectedTechnician?.id === technician.id && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full p-4">
                <h3 className="font-semibold">Reportes asignados</h3>
                <ul>
                  {/* Filtrar los servicios asociados al técnico y que no estén completados */}
                  {getTechnicianReports(technician.name).length > 0 ? (
                    getTechnicianReports(technician.name).map((service) => (
                      <li
                        key={service.id}
                        className="text-gray-700 mb-2 cursor-pointer"
                        onClick={() => openServiceModal(service)} // Abrir el modal al hacer clic
                      >
                        <strong>{service.title}</strong> - {service.description}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No hay reportes asignados</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mostrar el modal si está abierto */}
      {isModalOpen && localSelectedService && (
        <ServiceDetailModal
          service={localSelectedService}
          closeModal={closeModal} // Función para cerrar el modal
        />
      )}
    </aside>
  );
}

export default TechnicianSidebar;
