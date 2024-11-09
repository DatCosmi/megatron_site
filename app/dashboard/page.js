// Dashboard.js
"use client";
import React from "react";
import { SERVICES } from "../data/constants";
import Sidebar from "../components/dashboard/sidebar";

const Dashboard = () => {
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="dashboard">
          <h1 className="title">Dashboard de Servicios</h1>
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

          <div className="recent-orders">
            <h2>Reportes Recientes</h2>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Reporte</th>
                  <th>Fecha</th>
                  <th>Reportado por</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.slice(-5).map((service) => (
                  <tr key={service.id}>
                    <td>#{service.id}</td>
                    <td>{service.title}</td>
                    <td>{service.date}</td>
                    <td>{service.reportedBy}</td>
                    <td
                      className={
                        service.status === "pendiente"
                          ? "status-pending"
                          : service.status === "en-curso"
                          ? "status-in-progress"
                          : "status-completed"
                      }
                    >
                      {getStatusLabel(service.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
