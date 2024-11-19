import React from "react";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

function ServiceDetailModal({ report, closeModal }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return <AlertCircle className="w-6 h-6 text-[#ff006e]" />;
      case "ejecucion":
        return <Clock className="w-6 h-6 text-[#ffbe0b]" />;
      case "concluido":
        return <CheckCircle className="w-6 h-6 text-[#06d6a0]" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-[#ff006e]";
      case "ejecucion":
        return "bg-[#ffbe0b]";
      case "concluido":
        return "bg-[#06d6a0]";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pendiente":
        return "text-[#ff006e]";
      case "ejecucion":
        return "text-[#ffbe0b]";
      case "concluido":
        return "text-[#06d6a0]";
      default:
        return "text-gray-500";
    }
  };

  const formatFechaHora = (fecha) => {
    const fechaObj = new Date(fecha);
    const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };
    const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opcionesFecha);
    const horaFormateada = fechaObj.toLocaleTimeString("es-ES", opcionesHora);
    return `${fechaFormateada} a las ${horaFormateada}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full z-60 overflow-hidden">
        {/* Header with blue accent */}
        <div
          className={`p-8 text-center ${getStatusColor(
            report.estado
          )} bg-opacity-10`}
        >
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${getStatusColor(
              report.estado
            )} bg-opacity-20`}
          >
            {getStatusIcon(report.estado)}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {report.tituloReporte}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Detalles del reporte</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Folio:</span>
              <span className="text-gray-600">{report.folioReporte}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Descripción:</span>
              <span className="text-gray-600 max-w-[10vw]">
                {report.comentarios}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Ubicación:</span>
              <span className="text-gray-600">{report.nombreUbicacion}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Equipo:</span>
              <span className="text-gray-600">{report.numeroEquipo}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">No. de Serie:</span>
              <span className="text-gray-600">{report.numeroSerie}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Reportado por:</span>
              <span className="text-gray-600">{report.Cliente}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Tel. Cliente:</span>
              <span className="text-gray-600">{report.telefonoCliente}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Técnico:</span>
              <span className="text-gray-600">
                {report.TecnicoAsignado || "No asignado"}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Fecha y Hora:</span>
              <span className="text-gray-600">
                {formatFechaHora(report.fechaCreacion)}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-medium w-32">Estado:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  report.estado
                )} bg-opacity-10 ${getStatusText(report.estado)}`}
              >
                {report.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailModal;
