// app/components/dashboard/ServiceDetailModal.js
"use client";
import React from "react";

function ServiceDetailModal({ service, closeModal }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full z-60">
        <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
        <p className="text-gray-600 mb-2">
          <strong>Descripción:</strong> {service.description}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Departamento:</strong> {service.department}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Equipo:</strong> {service.equipment}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Reportado por:</strong> {service.reportedBy}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Fecha y Hora:</strong> {service.date} {service.time}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Estado:</strong> {service.status}
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
