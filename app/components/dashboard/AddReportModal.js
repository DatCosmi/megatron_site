"use client";
import { useState } from "react";
import { TECHNICIANS } from "../../data/constants";

function AddReportModal({ services, setServices, closeModal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [equipment, setEquipment] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString();
  const time = currentDate.toLocaleTimeString();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newService = {
      id: services.length + 1,
      title,
      description,
      department,
      equipment,
      reportedBy,
      date,
      time,
      status: "pendiente",
      assignedTo,
    };
    setServices((prevServices) => [...prevServices, newService]);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Agregar Reporte
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Título */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
              placeholder="Escribe el título"
              required
            />
          </div>

          {/* Campo Descripción */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
              placeholder="Escribe la descripción"
              required
            />
          </div>

          {/* Campo Departamento */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Departamento
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
              placeholder="Escribe el departamento"
              required
            />
          </div>

          {/* Campo Equipo */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Equipo
            </label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
              placeholder="Escribe el equipo"
              required
            />
          </div>

          {/* Campo Reportado por */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Reportado por
            </label>
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
              placeholder="Nombre del reportante"
              required
            />
          </div>

          {/* Campo Asignar a Técnico */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Asignar a Técnico
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
            >
              <option value="">Seleccione un técnico</option>
              {TECHNICIANS.map((technician) => (
                <option key={technician.id} value={technician.name}>
                  {technician.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-center space-x-4 mt-6">
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
