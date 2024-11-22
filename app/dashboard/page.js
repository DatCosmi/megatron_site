"use client";
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/navigation/sidebar";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

import axios from "axios";
import { AuthContext } from "../context/UsuarioContext";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageTime, setAverageTime] = useState(null);

  const { authState, loadUserDetails } = useContext(AuthContext); // Accede al estado global
  const { rol, iduser, token, userDetails } = authState;

  const [locationStats, setLocationStats] = useState({
    fastest: [],
    slowest: [],
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const initializeDashboard = async () => {
    setLoading(true);
    setError(null);

    let clienteId = null;
    let tecnicoId = null;

    if (rol === "cliente" && userDetails) {
      clienteId = userDetails.idClientes;
    } else if (rol === "tecnico" && userDetails) {
      tecnicoId = userDetails.idTecnicos;
    }

    const reportData = await LoadReportsDetails(clienteId, tecnicoId);
    setReports(Array.isArray(reportData) ? reportData : []);
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
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const result = await response.json();
      if (result) {
        console.log(
          "LoadReportsDetails: Detalles del reporte obtenidos",
          result
        );
        return result;
      }
    } catch (err) {
      console.error(
        "Reports: Error al obtener los detalles de los reportes:",
        err.message
      );
    }
  };
  useEffect(() => {
    if (rol && iduser) {
      loadUserDetails(rol, iduser); // Solo depende de `rol` y `iduser`.
    }
  }, [iduser, rol]);
  
  useEffect(() => {
    if (userDetails) {
      initializeDashboard();
    }
  }, [userDetails]);

  useEffect(() => {
    if (Array.isArray(reports) && reports.length > 0) {
      calculateAverageTime();
      calculateLocationStats();
    }
    LoadReportsDetails();
  }, [reports]);

  const getReportCount = (status) => {
    if (!Array.isArray(reports)) return 0;
    return reports.filter((r) => r.estado === status).length;
  };

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

  const getGridCols = (rol) => {
    switch (rol) {
      case "admin":
        return "lg:col-span-1";
      case "cliente":
        return "lg:col-span-3";
      case "tecnico":
        return "lg:col-span-1";
      default:
        return;
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
    <div className="flex flex-col md:flex-row gap-2 h-screen bg-[#eaeef6] container-dashboard">
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
              <p className="text-4xl font-bold text-white">{reports.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-[#ff006e] to-[#d2095f]">
              <h2 className="text-sm font-medium text-gray-600 mb-2 text-white">
                Pendientes
              </h2>
              <p className="text-4xl font-bold text-white">
                {getReportCount("pendiente")}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-[#ffbe0b] to-[#bc8d0a]">
              <h2 className="text-sm font-medium text-gray-600 mb-2 text-white">
                En curso
              </h2>
              <p className="text-4xl font-bold text-white">
                {getReportCount("ejecucion")}
              </p>
            </div>
            <div
              className={`${getGridCols(
                rol
              )} bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-[#06d6a0] to-[#08a37b]`}
            >
              <h2 className="text-sm font-medium text-gray-600 mb-2 text-white">
                Completados
              </h2>
              <p className="text-4xl font-bold text-white">
                {getReportCount("concluido")}
              </p>
            </div>
            {rol === "admin" && (
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
            )}
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
                        {getSortIcon("folioReporte")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("tituloReporte")}
                    >
                      <div className="flex items-center gap-2">
                        Reporte
                        {getSortIcon("tituloReporte")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("fechaCreacion")}
                    >
                      <div className="flex items-center gap-2">
                        Fecha
                        {getSortIcon("fechaCreacion")}
                      </div>
                    </th>

                    {rol === "admin" && (
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("Cliente")}
                      >
                        <div className="flex items-center gap-2">
                          Reportado por
                          {getSortIcon("Cliente")}
                        </div>
                      </th>
                    )}

                    {rol === "cliente" && (
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("tecnicoAsignado")}
                      >
                        <div className="flex items-center gap-2">
                          Técnico asignado
                          {getSortIcon("tecnicoAsignado")}
                        </div>
                      </th>
                    )}

                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("estado")}
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
                      {rol === "admin" && (
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.Cliente}
                        </td>
                      )}
                      {rol === "cliente" && (
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.tecnicoAsignado}
                        </td>
                      )}
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <span className={getStatusBadge(report.estado)}>
                          {getStatusLabel(report.estado)}
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
        {rol === "admin" && (
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
