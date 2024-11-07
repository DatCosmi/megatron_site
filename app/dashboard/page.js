// components/Dashboard.js
"use client";
import { useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid"; // Importación actualizada para Heroicons v2
import Sidebar from "../components/sidebar";

const TECHNICIANS = [
  { id: 1, name: "Carlos Stanley" },
  { id: 2, name: "Ana García" },
  { id: 3, name: "Roberto Méndez" },
];

const SERVICES = [
  {
    id: 1,
    title: "Desarrollo Social",
    description: "El equipo está manchando las hojas",
    department: "Departamento de Soporte Técnico",
    equipment: "M 155",
    reportedBy: "Carlos Stanley",
    date: "01/10/2024",
    time: "13:23:41",
    status: "pendiente",
    assignedTo: null,
  },
  // Resto de los servicios...
];

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Pendientes" },
  { id: "en-curso", label: "En curso" },
  { id: "completada", label: "Completadas" },
];

function Dashboard() {
  const [services, setServices] = useState(SERVICES);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [selectedService, setSelectedService] = useState(null);

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

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Dashboard de Servicios</h1>
        </header>
        <div className="flex space-x-4 mb-6">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === filter.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="p-4 bg-white rounded-lg shadow-md cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <h2 className="text-lg font-semibold">{service.title}</h2>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-sm text-gray-500">{service.department}</p>
              <div className="flex items-center mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(
                    service.status
                  )}`}
                />
                <span className="ml-2 text-sm text-gray-500">
                  {getStatusText(service.status)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">
                {selectedService.title}
              </h2>
              <p>{selectedService.description}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => handleAssign(TECHNICIANS[0].id)} // Asignar al primer técnico como demo
              >
                Asignar a {TECHNICIANS[0].name}
              </button>
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={() => handleComplete(selectedService.id)}
              >
                Marcar como completado
              </button>
              <button
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => setSelectedService(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case "pendiente":
      return "bg-yellow-500";
    case "en-curso":
      return "bg-green-500";
    case "completada":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "pendiente":
      return "Pendiente";
    case "en-curso":
      return "En curso";
    case "completada":
      return "Completada";
    default:
      return status;
  }
};

export default Dashboard;
