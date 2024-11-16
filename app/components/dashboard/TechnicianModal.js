// app/components/dashboard/TechnicianModal.js
"use client";
import ProtectedRoute, { token } from "../../components/protectedRoute";
import axios from "axios";
import { useEffect, useState } from "react";

function TechnicianModal({ handleAssign, closeModal }) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch reports from the backend
  useEffect(() => {
    fetchTechnicians();
  }, []);

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Selecciona un técnico</h2>
          {technicians.map((technician) => (
            <button
              key={technician.idTecnicos}
              className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-blue-500 hover:text-white rounded-lg"
              onClick={() => handleAssign(technician.idTecnicos)}
            >
              {technician.Nombre} {technician.ApellidoPa}
            </button>
          ))}
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
