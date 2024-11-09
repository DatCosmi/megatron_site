// app/components/dashboard/TechnicianModal.js
"use client";
import { TECHNICIANS } from "../../data/constants";

function TechnicianModal({ handleAssign, closeModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Selecciona un técnico</h2>
        {TECHNICIANS.map((technician) => (
          <button
            key={technician.id}
            className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-blue-500 hover:text-white rounded-lg"
            onClick={() => handleAssign(technician.id)}
          >
            {technician.name}
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
  );
}

export default TechnicianModal;
