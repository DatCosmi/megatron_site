// components/Dashboard.js
"use client";
import { useEffect, useState } from "react";
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
    assignedTo: "Carlos Stanley",
  },
  {
    id: 2,
    title: "Reparación de Equipo",
    description: "Problema de encendido intermitente",
    department: "Departamento de Mantenimiento",
    equipment: "L 220",
    reportedBy: "Ana García",
    date: "02/10/2024",
    time: "09:15:23",
    status: "en-curso",
    assignedTo: "Juan Pérez",
  },
  {
    id: 3,
    title: "Instalación de Software",
    description: "Actualización a la última versión del sistema",
    department: "Departamento de TI",
    equipment: "PC 334",
    reportedBy: "Luis Morales",
    date: "03/10/2024",
    time: "11:45:10",
    status: "completada",
    assignedTo: null,
  },
  {
    id: 4,
    title: "Revisión de Red",
    description: "Optimización de conexiones en el área de oficinas",
    department: "Departamento de Redes",
    equipment: "Router X500",
    reportedBy: "Sara Martínez",
    date: "04/10/2024",
    time: "10:35:52",
    status: "en-curso",
    assignedTo: "Laura Núñez",
  },
  {
    id: 5,
    title: "Backup de Datos",
    description: "Respaldo de la base de datos principal",
    department: "Departamento de TI",
    equipment: "Servidor DB01",
    reportedBy: "Jorge Ramírez",
    date: "05/10/2024",
    time: "08:05:32",
    status: "completada",
    assignedTo: null,
  },
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
  const [isTechnicianListOpen, setIsTechnicianListOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [newReportData, setNewReportData] = useState({
    title: "",
    description: "",
    department: "",
    equipment: "",
    reportedBy: "",
    date: "",
    time: "",
  });
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  const filteredServices = services.filter((service) =>
    activeFilter === "todos" ? true : service.status === activeFilter
  );

  const servicesForTechnician = selectedTechnician
    ? services.filter(
        (service) => service.assignedTo === selectedTechnician.name
      )
    : [];

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

  // Establecer la fecha y hora automáticamente cuando se monta el componente
  useEffect(() => {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0]; // Fecha en formato YYYY-MM-DD
    const currentTimeString = currentDate
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5); // Hora en formato HH:MM

    setNewReportData((prevData) => ({
      ...prevData,
      date: currentDateString,
      time: currentTimeString,
    }));
  }, []);

  const handleAddReportSubmit = () => {
    const newReport = {
      id: services.length + 1,
      ...newReportData,
      status: "pendiente",
      assignedTo: null,
    };
    setServices([...services, newReport]);
    setIsAddReportModalOpen(false);
    setNewReportData({
      title: "",
      description: "",
      department: "",
      equipment: "",
      reportedBy: "",
      date: "",
      time: "",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Dashboard de Servicios</h1>
        </header>

        <div className="flex space-x-4 mb-6">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-full ${
                activeFilter === filter.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg"
          onClick={() => setIsAddReportModalOpen(true)}
        >
          Agregar Reporte
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg p-6 space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {service.title.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{service.title}</h2>
                  <p className="text-sm text-gray-500">{service.department}</p>
                </div>
              </div>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-sm text-gray-500">
                Reportado por: {service.reportedBy}
              </p>
              <p className="text-sm text-gray-500">
                Equipo: {service.equipment}
              </p>
              <p className="text-sm text-gray-500">
                Estado: {getStatusText(service.status)}
              </p>

              {service.status === "pendiente" && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
                  onClick={() => {
                    setSelectedService(service);
                    setIsTechnicianListOpen(true);
                  }}
                >
                  Asignar
                </button>
              )}
              {service.status === "en-curso" && (
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg w-full"
                    onClick={() => handleComplete(service.id)}
                  >
                    Completar
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg w-full"
                    onClick={() => {
                      setSelectedService(service);
                      setIsTechnicianListOpen(true);
                    }}
                  >
                    Reasignar
                  </button>
                </div>
              )}
              {service.status === "completada" && (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg w-full"
                  onClick={() => handleDelete(service.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {isTechnicianListOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">
                Selecciona un técnico
              </h2>
              <div className="space-y-2">
                {TECHNICIANS.map((technician) => (
                  <button
                    key={technician.id}
                    className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-blue-500 hover:text-white rounded-lg"
                    onClick={() => handleAssign(technician.id)}
                  >
                    {technician.name}
                  </button>
                ))}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg w-full"
                onClick={() => setIsTechnicianListOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {isAddReportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">
                Agregar Nuevo Reporte
              </h2>
              <input
                type="text"
                placeholder="Título"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={newReportData.title}
                onChange={(e) =>
                  setNewReportData({ ...newReportData, title: e.target.value })
                }
              />
              <textarea
                placeholder="Descripción"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={newReportData.description}
                onChange={(e) =>
                  setNewReportData({
                    ...newReportData,
                    description: e.target.value,
                  })
                }
              ></textarea>
              <input
                type="text"
                placeholder="Departamento"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={newReportData.department}
                onChange={(e) =>
                  setNewReportData({
                    ...newReportData,
                    department: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Equipo"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={newReportData.equipment}
                onChange={(e) =>
                  setNewReportData({
                    ...newReportData,
                    equipment: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Reportado por"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={newReportData.reportedBy}
                onChange={(e) =>
                  setNewReportData({
                    ...newReportData,
                    reportedBy: e.target.value,
                  })
                }
              />
              {/* Aquí no mostramos los campos de fecha y hora */}
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg w-full"
                onClick={handleAddReportSubmit}
              >
                Agregar Reporte
              </button>
              <button
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg w-full"
                onClick={() => setIsAddReportModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Barra lateral derecha */}
      <aside className="w-64 bg-white p-4 border-l border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Técnicos</h2>
        <div className="space-y-2">
          {TECHNICIANS.map((technician) => (
            <button
              key={technician.id}
              className={`w-full px-4 py-2 text-left rounded-lg ${
                selectedTechnician?.id === technician.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedTechnician(technician)}
            >
              {technician.name}
            </button>
          ))}
        </div>

        {/* Lista de reportes del técnico seleccionado */}
        {selectedTechnician && (
          <div className="mt-6">
            <h3 className="text-md font-semibold">Reportes Asignados</h3>
            <ul className="mt-2 space-y-2">
              {servicesForTechnician.length > 0 ? (
                servicesForTechnician.map((service) => (
                  <li key={service.id} className="bg-gray-200 rounded-lg p-2">
                    <p className="font-semibold">{service.title}</p>
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 mt-2">No hay reportes asignados.</p>
              )}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function getStatusText(status) {
  return (
    {
      pendiente: "Pendiente",
      "en-curso": "En curso",
      completada: "Completada",
    }[status] || "Desconocido"
  );
}

export default Dashboard;
