"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import ProtectedRoute, { token } from "../components/protectedRoute";
import { RoleProvider } from "../components/context/RoleContext";
import axios from "axios";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageTime, setAverageTime] = useState(null);
  const [locationStats, setLocationStats] = useState({
    fastest: [],
    slowest: [],
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const fetchReports = async () => {
    try {
      const storedId = localStorage.getItem("id");
      if (!storedId) {
        console.error("No ID found in localStorage");
        return;
      }

      const storedRole = localStorage.getItem("role");
      if (!storedId) {
        console.error("No role found in localStorage");
        return;
      }

      let endpoint;

      if (storedRole === "admin") {
        endpoint = `https://backend-integradora.vercel.app/api/reportesCreados`;
      } else if (storedRole === "cliente") {
        endpoint = `https://backend-integradora.vercel.app/api/reportesclientes/${storedId}`;
      } else if (storedRole === "tecnico") {
        endpoint = `https://backend-integradora.vercel.app/api/reportestecnicos/${storedId}`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  useEffect(() => {
    calculateAverageTime();
    calculateLocationStats();
  }, [reports]);

  const calculateAverageTime = () => {
    const validReports = reports.filter(
      (report) => report.fechaCreacion && report.FechaModificacion
    );

    if (validReports.length === 0) {
      setAverageTime(null);
      return;
    }

    const totalTime = validReports.reduce((acc, report) => {
      const creationDate = new Date(report.fechaCreacion);
      const modificationDate = new Date(report.FechaModificacion);
      return acc + (modificationDate - creationDate);
    }, 0);

    const average = totalTime / validReports.length;

    const days = Math.floor(average / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (average % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((average % (1000 * 60 * 60)) / (1000 * 60));

    setAverageTime({ days, hours, minutes });
  };

  const calculateLocationStats = () => {
    // Group reports by location
    const locationGroups = reports.reduce((acc, report) => {
      if (
        !report.nombreUbicacion ||
        !report.fechaCreacion ||
        !report.FechaModificacion
      ) {
        return acc;
      }

      if (!acc[report.nombreUbicacion]) {
        acc[report.nombreUbicacion] = [];
      }

      const creationDate = new Date(report.fechaCreacion);
      const modificationDate = new Date(report.FechaModificacion);
      const responseTime = modificationDate - creationDate;

      acc[report.nombreUbicacion].push(responseTime);
      return acc;
    }, {});

    // Calculate average time for each location
    const locationAverages = Object.entries(locationGroups).map(
      ([location, times]) => {
        const average = times.reduce((a, b) => a + b, 0) / times.length;
        return {
          location,
          averageTime: average,
          reportCount: times.length,
        };
      }
    );

    // Sort locations by average time
    const sortedLocations = locationAverages.sort(
      (a, b) => a.averageTime - b.averageTime
    );

    setLocationStats({
      fastest: sortedLocations.slice(0, 5),
      slowest: sortedLocations.slice(-5).reverse(),
    });
  };

  // Función para manejar el ordenamiento
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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

  const formatDuration = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

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
        <div className="flex h-screen bg-[#eaeef6] ml-64 container-dashboard">
          <Sidebar />
          <div className="flex-1 p-6 flex gap-6">
            {/* Main Content Column */}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Dashboard de Servicios
              </h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-blue-600 to-blue-800">
                  <h2 className="text-sm font-medium text-gray-600 mb-2 text-white">
                    Reportes totales
                  </h2>
                  <p className="text-4xl font-bold text-white">
                    {reports.length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-[#ff006e] to-[#d2095f]">
                  <h2 className="text-sm font-medium text-gray-600 mb-2 text-white">
                    Pendientes
                  </h2>
                  <p className="text-4xl font-bold text-white">
                    {
                      reports.filter((r) => r.estadoReporte === "pendiente")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-[#ffbe0b] to-[#bc8d0a]">
                  <h2 className="text-sm font-medium text-gray-600 mb-2 text-white">
                    En curso
                  </h2>
                  <p className="text-4xl font-bold text-white">
                    {
                      reports.filter((r) => r.estadoReporte === "ejecucion")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-[#06d6a0] to-[#08a37b]">
                  <h2 className="text-sm font-medium text-gray-600 mb-2 text-white">
                    Completados
                  </h2>
                  <p className="text-4xl font-bold text-white">
                    {
                      reports.filter((r) => r.estadoReporte === "concluido")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow col-span-2 bg-gradient-to-r from-indigo-600 to-indigo-800">
                  <h2 className="text-sm font-medium text-gray-600 mb-2 text-white">
                    Tiempo promedio en atender reportes
                  </h2>
                  <p className="text-4xl font-bold text-white">
                    {averageTime
                      ? `${averageTime.days}d ${averageTime.hours}h ${averageTime.minutes}m`
                      : "No disponible"}
                  </p>
                </div>
              </div>

              {/* Recent Reports Table */}
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
                          onClick={() => handleSort("EstadoReporte")}
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
                        <tr key={report.folioReporte}>
                          <td className="pl-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                          <td className="px-3 py-4 whitespace-nowrap text-sm">
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

            {/* Right Column for Location Stats */}
            <div className="w-80 space-y-6 flex justify-center items-center flex-col">
              {/* Fastest Locations */}
              <div className="bg-white rounded-lg shadow p-4 min-w-80">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Lugares mas rápidos de atender
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                          Ubicación
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                          Tiempo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationStats.fastest.map((stat, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 text-sm text-gray-900">
                            {stat.location}
                          </td>
                          <td className="py-2 text-sm text-gray-500 text-right">
                            {formatDuration(stat.averageTime)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Slowest Locations */}
              <div className="bg-white rounded-lg shadow p-4 min-w-80">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Lugares más lentos de atender
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                          Ubicación
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                          Tiempo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationStats.slowest.map((stat, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 text-sm text-gray-900">
                            {stat.location}
                          </td>
                          <td className="py-2 text-sm text-gray-500 text-right">
                            {formatDuration(stat.averageTime)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </RoleProvider>
  );
};

export default Dashboard;
