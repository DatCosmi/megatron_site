"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar";
import TechnicianSidebar from "../components/dashboard/TechnicianSidebar";
import TechnicianModal from "../components/dashboard/TechnicianModal";
import AddReportModal from "../components/dashboard/AddReportModal";
import ServiceDetailModal from "../components/dashboard/SerciceDetailModal";
import { SERVICES, FILTERS, TECHNICIANS } from "../data/constants";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  Users,
  Calendar,
} from "lucide-react";

function Reports() {
  const [services, setServices] = useState(SERVICES);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [selectedService, setSelectedService] = useState(null);
  const [isTechnicianListOpen, setIsTechnicianListOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [isServiceDetailModalOpen, setIsServiceDetailModalOpen] =
    useState(false);

  const filteredServices = services.filter((service) =>
    activeFilter === "todos" ? true : service.status === activeFilter
  );

  const handleAssign = (technicianId) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === selectedService.id
          ? {
              ...service,
              status: "en-curso",
              assignedTo: TECHNICIANS.find((tech) => tech.id === technicianId)
                .name,
            }
          : service
      )
    );
    setSelectedService(null);
    setIsTechnicianListOpen(false);
  };

  const handleReassign = (technicianId, serviceId) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              assignedTo: TECHNICIANS.find((tech) => tech.id === technicianId)
                .name,
            }
          : service
      )
    );
  };

  const handleComplete = (serviceId) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId
          ? { ...service, status: "completada" }
          : service
      )
    );
  };

  const handleDelete = (serviceId) => {
    setServices((prevServices) =>
      prevServices.filter((s) => s.id !== serviceId)
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return <AlertCircle className="w-6 h-6 text-[#ff006e]" />;
      case "en-curso":
        return <Clock className="w-6 h-6 text-[#ffbe0b]" />;
      case "completada":
        return <CheckCircle className="w-6 h-6 text-[#06d6a0]" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-[#ff006e]";
      case "en-curso":
        return "bg-[#ffbe0b]";
      case "completada":
        return "bg-[#06d6a0]";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#eff1f6] mr-80 ml-60">
      <Sidebar />

      <main className="flex-1 p-8">
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
            <button
              onClick={() => setIsAddReportModalOpen(true)}
              className="p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </header>

          <div className="flex gap-4 mb-8">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? "bg-[#2d57d1] text-white"
                    : "text-gray-600 bg-[#eff1f6] hover:bg-gray-50"
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
                <span className="ml-2 text-xs">
                  {
                    services.filter((s) =>
                      filter.id === "todos" ? true : s.status === filter.id
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex"
              >
                <div className={`w-1 ${getStatusColor(service.status)}`}></div>
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-2 rounded-xl ${getStatusColor(
                        service.status
                      )} bg-opacity-10`}
                    >
                      {getStatusIcon(service.status)}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {service.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {service.department}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{service.assignedTo || "Sin asignar"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{service.date}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      className="w-full px-4 py-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors text-sm font-medium"
                      onClick={() => {
                        setSelectedService(service);
                        setIsServiceDetailModalOpen(true);
                      }}
                    >
                      Ver Detalles
                    </button>

                    {service.status === "pendiente" && !service.assignedTo && (
                      <button
                        className="w-full px-4 py-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        onClick={() => {
                          setSelectedService(service);
                          setIsTechnicianListOpen(true);
                        }}
                      >
                        Asignar
                      </button>
                    )}

                    {service.status === "pendiente" && service.assignedTo && (
                      <button
                        className="w-full px-4 py-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        onClick={() => {
                          setSelectedService(service);
                          setIsTechnicianListOpen(true);
                        }}
                      >
                        Reasignar
                      </button>
                    )}

                    {service.status === "en-curso" && (
                      <>
                        <button
                          className="w-full px-4 py-2 bg-white border border-[#2d57d1] text-[#2d57d1] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          onClick={() => {
                            setSelectedService(service);
                            setIsTechnicianListOpen(true);
                          }}
                        >
                          Reasignar
                        </button>
                        <button
                          className="w-full px-4 py-2 bg-[#35cd63] text-white rounded-lg hover:bg-[#28b552] transition-colors text-sm font-medium"
                          onClick={() => handleComplete(service.id)}
                        >
                          Completar
                        </button>
                      </>
                    )}

                    {service.status === "completada" && (
                      <button
                        className="w-full px-4 py-2 bg-[#f71b49] text-white rounded-lg hover:bg-[#df1f47] transition-colors text-sm font-medium"
                        onClick={() => handleDelete(service.id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isTechnicianListOpen && (
          <TechnicianModal
            handleAssign={handleAssign}
            handleReassign={handleReassign}
            closeModal={() => setIsTechnicianListOpen(false)}
          />
        )}
        {isAddReportModalOpen && (
          <AddReportModal
            services={services}
            setServices={setServices}
            closeModal={() => setIsAddReportModalOpen(false)}
          />
        )}
        {isServiceDetailModalOpen && selectedService && (
          <ServiceDetailModal
            service={selectedService}
            closeModal={() => setIsServiceDetailModalOpen(false)}
          />
        )}
      </main>

      <TechnicianSidebar
        services={services}
        setSelectedService={setSelectedService}
        setIsTechnicianListOpen={setIsTechnicianListOpen}
      />
    </div>
  );
}

export default Reports;
