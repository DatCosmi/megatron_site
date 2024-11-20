import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ reports, setFilteredReports, activeFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);

    // Si la búsqueda está vacía, mantener solo los filtros de fecha y estado
    if (!value.trim()) {
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter((report) => {
      // La búsqueda se aplica sobre los reportes que ya están filtrados por fecha
      const searchLower = value.toLowerCase();
      const folioString = report.folioReporte?.toString() || "";

      return (
        folioString.includes(searchLower) ||
        report.tituloReporte?.toLowerCase().includes(searchLower) ||
        report.nombreUbicacion?.toLowerCase().includes(searchLower) ||
        report.numeroEquipo?.toLowerCase().includes(searchLower) ||
        report.Cliente?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredReports(filtered);
  };

  // Actualizar la búsqueda cuando cambian los reportes base o el filtro
  useEffect(() => {
    handleSearch(searchTerm);
  }, [reports, activeFilter]);

  return (
    <div className="relative mb-6 rounded-lg shadow-sm w-[60%] mt-5">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent"
        placeholder="Buscar por folio, nombre, ubicación, equipo o cliente..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
