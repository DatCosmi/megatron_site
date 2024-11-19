"use client";
import { useEffect, useState } from "react";
import ProtectedRoute, { token } from "../../components/protectedRoute";

function AddReportModal({ reports, setReports, closeModal }) {
  const [TituloReporte, setTituloReporte] = useState("");
  const [FolioReporte, setFolioReporte] = useState("");
  const [estado, setEstado] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [creadorReporte, setCreadorReporte] = useState("");
  const [tecnicoAsignado, setTecnicoAsignado] = useState("");
  const [idEquipos, setIdEquipos] = useState("");

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString();
  const time = currentDate.toLocaleTimeString();

  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchEquipos = async () => {
    try {
      const response = await fetch(
        "https://backend-integradora.vercel.app/api/equipos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setEquipos(data);
    } catch (error) {
      console.error("Error fetching Equipos:", error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await fetch(
        "https://backend-integradora.vercel.app/api/clientes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error fetching Clientes:", error);
    }
  };

  const fetchTecnicos = async () => {
    try {
      const response = await fetch(
        "https://backend-integradora.vercel.app/api/tecnicos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setTecnicos(data);
    } catch (error) {
      console.error("Error fetching Tecnicos:", error);
    }
  };

  useEffect(() => {
    fetchEquipos();
    fetchClientes();
    fetchTecnicos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Datos del producto a enviar
    const reportData = {
      TituloReporte,
      FolioReporte,
      fechaCreacion: currentDate,
      fechaHoraActualizacion: currentDate,
      estado: "pendiente",
      comentarios,
      creadorReporte,
      tecnicoAsignado,
      idEquipos,
    };

    try {
      let response;

      // Agregar nuevo reporte
      response = await fetch(
        "https://backend-integradora.vercel.app/api/reportes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el reporte");
      }

      // Cerrar el modal y limpiar los campos si es necesario
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-4xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Agregar Reporte
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primera fila: Título y Folio */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-2 text-sm font-medium">
                Título
              </label>
              <input
                type="text"
                value={TituloReporte}
                onChange={(e) => setTituloReporte(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Escribe el título"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2 text-sm font-medium">
                Folio
              </label>
              <input
                type="text"
                value={FolioReporte}
                onChange={(e) => setFolioReporte(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Escribe el folio"
                required
              />
            </div>
          </div>

          {/* Segunda fila: Descripción (ancho completo) */}
          <div>
            <label className="block text-gray-600 mb-2 text-sm font-medium">
              Descripción del problema
            </label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1] min-h-[100px]"
              placeholder="Escribe la descripción detallada del problema"
              required
            />
          </div>

          {/* Tercera fila: Selects */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-600 mb-2 text-sm font-medium">
                Equipo
              </label>
              <select
                value={idEquipos}
                onChange={(e) => setIdEquipos(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
              >
                <option value="">Seleccione un equipo</option>
                {equipos.map((equipo) => (
                  <option key={equipo.idEquipos} value={equipo.idEquipos}>
                    {equipo.NumeroEquipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-2 text-sm font-medium">
                Reportado por
              </label>
              <select
                value={creadorReporte}
                onChange={(e) => setCreadorReporte(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
              >
                <option value="">Nombre del reportante</option>
                {clientes.map((cliente) => (
                  <option key={cliente.idClientes} value={cliente.idClientes}>
                    {cliente.Nombre} {cliente.ApellidoPa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-2 text-sm font-medium">
                Asignar a Técnico
              </label>
              <select
                value={tecnicoAsignado}
                onChange={(e) => setTecnicoAsignado(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
              >
                <option value="">Seleccione un técnico</option>
                {tecnicos.map((tecnico) => (
                  <option key={tecnico.idTecnicos} value={tecnico.idTecnicos}>
                    {tecnico.Nombre} {tecnico.ApellidoPa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm font-medium hover:bg-[#1a42b6] focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
            >
              Generar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReportModal;
