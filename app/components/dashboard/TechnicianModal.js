"use client";
import ProtectedRoute, { token } from "../../components/protectedRoute";
import axios from "axios";
import { useEffect, useState } from "react";

function TechnicianModal({ reports, setReports, closeModal, reportToEdit }) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/tecnicos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleAssign = async (idTecnicos) => {
    // Preparar los datos para enviar
    const reportData = {
      tecnicoAsignado: idTecnicos,
    };

    try {
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/reportes/${reportToEdit}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al asignar el reporte");
      }

      setSuccessMessage("Técnico asignado exitosamente.");
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      console.error(error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Selecciona un técnico</h2>
          {loading ? (
            <p>Cargando técnicos...</p>
          ) : technicians.length === 0 ? (
            <p>No hay técnicos disponibles.</p>
          ) : (
            technicians.map((technician) => (
              <button
                key={technician.idTecnicos}
                className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-blue-500 hover:text-white rounded-lg"
                onClick={() => handleAssign(technician.idTecnicos)}
              >
                {technician.Nombre} {technician.ApellidoPa}
              </button>
            ))
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 mt-4">{successMessage}</p>
          )}
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg w-full"
            onClick={closeModal}
          >
            Cancelar
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default TechnicianModal;
