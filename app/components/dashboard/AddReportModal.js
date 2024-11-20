"use client";
import { useEffect, useState } from "react";
import { token } from "../../components/protectedRoute";
import { ChevronDown } from "lucide-react";

function AddReportModal({ role, reports, setReports, closeModal }) {
  const [TituloReporte, setTituloReporte] = useState("");
  const [FolioReporte, setFolioReporte] = useState("");
  const [estado, setEstado] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [creadorReporte, setCreadorReporte] = useState("");
  const [searchText, setSearchText] = useState("");
  const [equipoSearchText, setEquipoSearchText] = useState(""); // Nuevo estado para búsqueda de equipo
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEquipoSuggestions, setShowEquipoSuggestions] = useState(false); // Nuevo estado para sugerencias de equipo
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]); // Nuevo estado para equipos filtrados
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

  // Mantener los fetchs igual...
  const fetchEquipos = async () => {
    try {
      const response = await fetch(
        "https://backend-integradora.vercel.app/api/equipos",
        {
          headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
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

  // Cliente search handlers
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    setCreadorReporte("");

    if (searchValue.trim() === "") {
      setShowSuggestions(false);
      setFilteredClientes([]);
      return;
    }

    const filtered = clientes.filter((cliente) =>
      `${cliente.Nombre} ${cliente.ApellidoPa}`
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );

    setFilteredClientes(filtered);
    setShowSuggestions(true);
  };

  const handleClienteSelect = (cliente) => {
    setSearchText(`${cliente.Nombre} ${cliente.ApellidoPa}`);
    setCreadorReporte(cliente.idClientes);
    setShowSuggestions(false);
  };

  // Nuevo: Equipo search handlers
  const handleEquipoSearchChange = (e) => {
    const searchValue = e.target.value;
    setEquipoSearchText(searchValue);
    setIdEquipos("");

    if (searchValue.trim() === "") {
      setShowEquipoSuggestions(false);
      setFilteredEquipos([]);
      return;
    }

    const filtered = equipos.filter((equipo) =>
      equipo.NumeroEquipo.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );

    setFilteredEquipos(filtered);
    setShowEquipoSuggestions(true);
  };

  const handleEquipoSelect = (equipo) => {
    setEquipoSearchText(equipo.NumeroEquipo);
    setIdEquipos(equipo.idEquipos);
    setShowEquipoSuggestions(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const response = await fetch(
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

      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      closeModal();
    }
  };

  const getGridCols = (role) => {
    switch (role) {
      case "admin":
        return "2";
      case "cliente":
        return "1";
      default:
        return;
    }
  };

  const getGridCols2 = (role) => {
    switch (role) {
      case "admin":
        return "3";
      case "cliente":
        return "1";
      default:
        return;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-4xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Agregar Reporte
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primera fila igual... */}
          <div className={`grid grid-cols-${getGridCols(role)} gap-6`}>
            <div>
              <label className="block text-gray-600 mb-2 text-sm font-medium">
                Problema
              </label>
              <input
                type="text"
                value={TituloReporte}
                onChange={(e) => setTituloReporte(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Escribe una breve descripción del problema"
                required
              />
            </div>

            {role === "admin" && (
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
            )}
          </div>

          {/* Campo de descripción igual... */}
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

          {/* Tercera fila con ambos autocompletados */}
          <div className={`grid grid-cols-${getGridCols(role)} gap-6`}>
            <div className="relative">
              <label className="block text-gray-600 mb-2 text-sm font-medium">
                Equipo
              </label>
              <input
                type="text"
                value={equipoSearchText}
                onChange={handleEquipoSearchChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Buscar equipo..."
                required
              />
              {showEquipoSuggestions && filteredEquipos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredEquipos.map((equipo) => (
                    <div
                      key={equipo.idEquipos}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEquipoSelect(equipo)}
                    >
                      {equipo.NumeroEquipo}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {role === "admin" && (
              <div className="relative">
                <label className="block text-gray-600 mb-2 text-sm font-medium">
                  Reportado por
                </label>
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                  placeholder="Buscar cliente..."
                  required
                />
                {showSuggestions && filteredClientes.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredClientes.map((cliente) => (
                      <div
                        key={cliente.idClientes}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleClienteSelect(cliente)}
                      >
                        {cliente.Nombre} {cliente.ApellidoPa}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {role === "admin" && (
              <div>
                <label className="block text-gray-600 mb-2 text-sm font-medium">
                  Asignar a Técnico
                </label>
                <div className="relative">
                  <select
                    value={tecnicoAsignado}
                    onChange={(e) => setTecnicoAsignado(e.target.value)}
                    className="w-full appearance-none p-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent text-gray-600"
                  >
                    <option value="">Seleccione un técnico</option>
                    {tecnicos.map((tecnico) => (
                      <option
                        key={tecnico.idTecnicos}
                        value={tecnico.idTecnicos}
                      >
                        {tecnico.Nombre} {tecnico.ApellidoPa}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Botones igual... */}
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
