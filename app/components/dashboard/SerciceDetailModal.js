// app/components/dashboard/ServiceDetailModal.js
"use client";
import React from "react";

function ServiceDetailModal({ report, closeModal }) {
  //Formatear fecha y hora
  const formatFechaHora = (fecha) => {
    const fechaObj = new Date(fecha); // Convierte la cadena en un objeto Date
    const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };

    const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opcionesFecha);
    const horaFormateada = fechaObj.toLocaleTimeString("es-ES", opcionesHora);

    return `${fechaFormateada} a las ${horaFormateada}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full z-60">
        <h2 className="text-2xl font-semibold mb-4">{report.tituloReporte}</h2>
        <p className="text-gray-600 mb-2">
          <strong>Descripción:</strong> {report.comentarios}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Departamento:</strong> {report.nombreUbicacion}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Equipo:</strong> {report.numeroEquipo}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Reportado por:</strong> {report.Cliente}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Fecha y Hora:</strong> {formatFechaHora(report.fechaCreacion)}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Estado:</strong> {report.estadoReporte}
        </p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={closeModal}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ServiceDetailModal;
