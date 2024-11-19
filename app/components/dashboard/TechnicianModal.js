import { UserCircle2 } from "lucide-react";
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
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full overflow-hidden">
          {/* Header with blue accent */}
          <div className="bg-blue-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Selecciona un técnico
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Asigna un técnico al reporte
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Cargando técnicos...</p>
              </div>
            ) : technicians.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay técnicos disponibles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3">
                {technicians.map((technician) => (
                  <button
                    key={technician.idTecnicos}
                    onClick={() => handleAssign(technician.idTecnicos)}
                    className="w-full flex items-center p-3 text-left rounded-lg transition-colors duration-200 hover:bg-blue-50 group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200">
                      <UserCircle2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-600">
                      {technician.Nombre} {technician.ApellidoPa}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg">
                {successMessage}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50">
            <button
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default TechnicianModal;
