"use client";
import React, { useState } from "react";
import { SERVICES } from "../data/constants";
import Sidebar from "../components/dashboard/sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import ProtectedRoute from "../components/protectedRoute";
import { RoleProvider } from "../components/context/RoleContext";

const Dashboard = () => {
  // Estado para el ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const totalReports = SERVICES.length;
  const pendingReports = SERVICES.filter(
    (service) => service.status === "pendiente"
  ).length;
  const inProgressReports = SERVICES.filter(
    (service) => service.status === "en-curso"
  ).length;
  const completedReports = SERVICES.filter(
    (service) => service.status === "completada"
  ).length;

  const getStatusBadge = (status) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "pendiente":
        return `${baseClasses} bg-pink-50 text-[#ff006e] border border-pink-200`;
      case "en-curso":
        return `${baseClasses} bg-amber-50 text-[#ffbe0b] border border-amber-200`;
      case "completada":
        return `${baseClasses} bg-emerald-50 text-[#06d6a0] border border-emerald-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-800 border border-gray-200`;
    }
  };

  const getStatusLabel = (status) => {
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

  // Función para manejar el ordenamiento
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Función para obtener los datos ordenados
  const getSortedServices = () => {
    const servicesCopy = [...SERVICES];
    if (!sortConfig.key) return servicesCopy.slice(-5);

    return servicesCopy
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
      .slice(-5);
  };

  // Función para renderizar el ícono de ordenamiento
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 text-gray-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-gray-600" />
    );
  };

  return (
    <RoleProvider>
      <ProtectedRoute>
        <div className="flex h-screen bg-[#eff1f6] ml-60 container-dashboard">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="dashboard">
              <h1 className="title font-semibold text-gray-800">
                Dashboard de Servicios
              </h1>
              <div className="stats">
                <div className="stat-card stat-card-total">
                  <h2>Reportes totales</h2>
                  <p>{totalReports}</p>
                </div>
                <div className="stat-card stat-card-pending">
                  <h2>Pendientes</h2>
                  <p>{pendingReports}</p>
                </div>
                <div className="stat-card stat-card-in-progress">
                  <h2>En curso</h2>
                  <p>{inProgressReports}</p>
                </div>
                <div className="stat-card stat-card-completed">
                  <h2>Completados</h2>
                  <p>{completedReports}</p>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Reportes Recientes
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 recent-orders">
                    <thead>
                      <tr className="bg-gray-50">
                        <th
                          scope="col"
                          className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("id")}
                        >
                          <div className="flex items-center gap-2">
                            Folio
                            {getSortIcon("id")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("title")}
                        >
                          <div className="flex items-center gap-2">
                            Reporte
                            {getSortIcon("title")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center gap-2">
                            Fecha
                            {getSortIcon("date")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("reportedBy")}
                        >
                          <div className="flex items-center gap-2">
                            Reportado por
                            {getSortIcon("reportedBy")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center gap-2">
                            Estado
                            {getSortIcon("status")}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getSortedServices().map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                            #{service.id}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {service.title}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {service.date}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {service.reportedBy}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className={getStatusBadge(service.status)}>
                              {getStatusLabel(service.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </RoleProvider>
  );
};

export default Dashboard;
