import React, { useContext, useState } from "react";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { AuthContext } from "../../context/UsuarioContext";
import toast, { Toaster } from "react-hot-toast";

function ServiceDetailModal({ report, closeModal, onSave, rol }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState(report);
  const { authState } = useContext(AuthContext);
  const { token } = authState;

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

  const getStatusTextColor = (status) => {
    switch (status) {
      case "pendiente":
        return "text-[#ff006e] border border-pink-300";
      case "ejecucion":
        return "text-[#ffbe0b] border border-amber-300";
      case "concluido":
        return "text-[#06d6a0] border border-emerald-300";
      default:
        return "text-gray-500 border border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pendiente":
        return "Pendiente";
      case "ejecucion":
        return "En curso";
      case "concluido":
        return "Concluido";
      default:
        return "No disponible";
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
  const [formData, setFormData] = useState({
    TituloReporte: report?.tituloReporte || "",
    FolioReporte: report?.folioReporte || "",
    fechaHoraActualizacion: new Date().toISOString(), // Fecha y hora actual
    comentarios: report?.comentarios || "",
    ComentariosFinales: report?.ComentariosFinales || "",
    IdReporte: report.IdReporte,
  });

  const handleSave = async () => {
    const response = await fetch(
      `https://backend-integradora.vercel.app/api/reportes/${report.IdReporte}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );
    if (!response.ok) {
      toast.error("Error al actualizar los datos del reporte");
      throw new Error("Error al actualizar los datos del reporte");
    }

    closeModal();
    toast.success("Reporte actualizado exitosamente");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full z-60 overflow-hidden">
        {!isEditing ? (
          <>
            {/* Encabezado */}
            <div
              className={`p-6 text-center ${getStatusColor(
                report.estado
              )} bg-opacity-10`}
            >
              <div
                className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${getStatusColor(
                  report.estado
                )} bg-opacity-15 shadow-sm`}
              >
                {getStatusIcon(report.estado)}
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {report.tituloReporte}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Detalles del reporte</p>
            </div>

            {/* Contenido */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* Campo individual */}
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">Folio:</p>
                  <p className="text-gray-600 text-sm">
                    {report.folioReporte || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    Descripción:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {report.comentarios || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    Comentarios finales:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {report.ComentariosFinales || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    Ubicación:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {report.nombreUbicacion ||
                      report.ubicacion ||
                      "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    Dirección:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {report.Direccion || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    Código Postal:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {report.CodigoPostal || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">Equipo:</p>
                  <p className="text-gray-600 text-sm">
                    {report.numeroEquipo || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    No. de Serie:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {report.numeroSerie || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    Reportado por:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {report.Cliente ||
                      report.nombreCliente ||
                      report.creadorReporte ||
                      "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    Tel. Cliente:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {report.telefonoCliente || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">Técnico:</p>
                  <p className="text-gray-600 text-sm">
                    {report.TecnicoAsignado ||
                      report.tecnicoAsignado ||
                      report.nombreTecnico ||
                      "No asignado"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">
                    Fecha y Hora:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {formatFechaHora(report.fechaCreacion) || "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-sm">Estado:</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      report.estado
                    )} bg-opacity-10 ${getStatusTextColor(report.estado)}`}
                  >
                    {getStatusText(report.estado) || "No disponible"}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="px-4 py-3 bg-gray-50 flex justify-between">
              {rol !== "tecnico" && (
                <button
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </button>
              )}
              <button
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm transition-colors duration-200"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Formulario de edición */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Editar Reporte
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Título Reporte
                  </label>
                  <input
                    type="text"
                    name="TituloReporte"
                    value={formData.TituloReporte}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Folio Reporte
                  </label>
                  <input
                    type="text"
                    name="FolioReporte"
                    value={formData.FolioReporte}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Comentarios
                  </label>
                  <textarea
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Comentarios Finales
                  </label>
                  <textarea
                    name="ComentariosFinales"
                    value={formData.ComentariosFinales}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                  />
                </div>
              </form>
            </div>

            {/* Botones del formulario */}
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                onClick={handleSave}
              >
                Guardar
              </button>
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default ServiceDetailModal;
