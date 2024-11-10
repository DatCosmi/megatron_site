// app/components/dashboard/AddReportModal.js
"use client";
import { useState } from "react";
import { TECHNICIANS } from "../../data/constants";

function AddReportModal({ services, setServices, closeModal }) {
  // Estados para los campos del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [equipment, setEquipment] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState(""); // Aquí definimos el estado para el técnico asignado

  // Obtener la fecha y hora actuales automáticamente
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString(); // formato: dd/mm/yyyy
  const time = currentDate.toLocaleTimeString(); // formato: hh:mm:ss

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear el nuevo reporte
    const newService = {
      id: services.length + 1, // ID automático basado en el tamaño de la lista
      title,
      description,
      department,
      equipment,
      reportedBy,
      date, // Fecha actual
      time, // Hora actual
      status: "pendiente", // Estado por defecto
      assignedTo, // Aquí se usa el estado de assignedTo
    };

    // Añadir el reporte a la lista de servicios
    setServices((prevServices) => [...prevServices, newService]);

    // Cerrar el modal después de agregar el reporte
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg z-60">
        <h2 className="text-xl font-semibold mb-4">Agregar Reporte</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título del reporte */}
          <div>
            <label className="block text-gray-700">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Descripción del reporte */}
          <div>
            <label className="block text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-gray-700">Departamento</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Equipo */}
          <div>
            <label className="block text-gray-700">Equipo</label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Reportado por */}
          <div>
            <label className="block text-gray-700">Reportado por</label>
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Asignar técnico */}
          <div>
            <label className="block text-gray-700">Asignar a Técnico</label>
            <select
              value={assignedTo} // El valor de la selección es el estado de assignedTo
              onChange={(e) => setAssignedTo(e.target.value)} // Se actualiza el estado cuando se selecciona un técnico
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Seleccione un técnico</option>
              {TECHNICIANS.map((technician) => (
                <option key={technician.id} value={technician.name}>
                  {technician.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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
