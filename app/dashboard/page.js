"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import ProtectedRoute, { token } from "../components/protectedRoute";
import { RoleProvider } from "../components/context/RoleContext";
import axios from "axios";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchReports();
  }, []);

  // Estado para el ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const totalReports = reports.length;
  const pendingReports = reports.filter(
    (report) => report.estadoReporte === "pendiente"
  ).length;
  const inProgressReports = reports.filter(
    (report) => report.estadoReporte === "ejecucion"
  ).length;
  const completedReports = reports.filter(
    (report) => report.estadoReporte === "concluido"
  ).length;

  const getStatusBadge = (status) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "pendiente":
        return `${baseClasses} bg-pink-50 text-[#ff006e] border border-pink-200`;
      case "ejecucion":
        return `${baseClasses} bg-amber-50 text-[#ffbe0b] border border-amber-200`;
      case "concluido":
        return `${baseClasses} bg-emerald-50 text-[#06d6a0] border border-emerald-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-800 border border-gray-200`;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pendiente":
        return "Pendiente";
      case "ejecucion":
        return "En curso";
      case "concluido":
        return "Completado";
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
  const getSortedReports = () => {
    const reportsCopy = [...reports];
    if (!sortConfig.key) return reportsCopy.slice(-5);

    return reportsCopy
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

  //Formatear fecha y hora
  const formatFechaHora = (fecha) => {
    const fechaObj = new Date(fecha);
    const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };

    const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opcionesFecha);
    const horaFormateada = fechaObj.toLocaleTimeString("es-ES", opcionesHora);

    return `${fechaFormateada}`;
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
                          onClick={() => handleSort("folioReporte")}
                        >
                          <div className="flex items-center gap-2">
                            Folio
                            {getSortIcon("folio")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("tituloReporte")}
                        >
                          <div className="flex items-center gap-2">
                            Reporte
                            {getSortIcon("reporte")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("fechaCreacion")}
                        >
                          <div className="flex items-center gap-2">
                            Fecha
                            {getSortIcon("fecha")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("Cliente")}
                        >
                          <div className="flex items-center gap-2">
                            Reportado por
                            {getSortIcon("reportado por")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("estadoReporte")}
                        >
                          <div className="flex items-center gap-2">
                            Estado
                            {getSortIcon("estado")}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getSortedReports().map((report) => (
                        <tr key={report.IdReporte} className="hover:bg-gray-50">
                          <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                            {report.folioReporte}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {report.tituloReporte}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFechaHora(report.fechaCreacion)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {report.Cliente}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span
                              className={getStatusBadge(report.estadoReporte)}
                            >
                              {getStatusLabel(report.estadoReporte)}
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
