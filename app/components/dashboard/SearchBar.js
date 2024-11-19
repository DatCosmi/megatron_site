import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ reports, setFilteredReports, activeFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      // Si la búsqueda está vacía, mostrar todos los reportes que coincidan con el filtro activo
      setFilteredReports(
        reports.filter((report) =>
          activeFilter === "todos" ? true : report.estado === activeFilter
        )
      );
      return;
    }

    const filtered = reports.filter((report) => {
      // First apply the active filter
      const matchesStatus =
        activeFilter === "todos" ? true : report.estado === activeFilter;

      // Then apply the search term
      const searchLower = value.toLowerCase();
      const matchesSearch =
        report.tituloReporte?.toLowerCase().includes(searchLower) ||
        report.nombreUbicacion?.toLowerCase().includes(searchLower) ||
        report.numeroEquipo?.toLowerCase().includes(searchLower) ||
        report.Cliente?.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });

    setFilteredReports(filtered);
  };

  // Actualizar los reportes filtrados cuando cambian los reportes o el filtro activo
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
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent bg-white placeholder-gray-400 text-sm"
        placeholder="Buscar por nombre, ubicación, equipo o cliente..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
