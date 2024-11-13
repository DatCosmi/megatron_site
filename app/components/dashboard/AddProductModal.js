"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

function AddProductModal({ printers, setPrinters, closeModal }) {
  const [status, setStatus] = useState("");
  const [number, setNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [characteristics, setCharacteristics] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrinter = {
      id: printers.length + 1,
      status,
      number,
      serialNumber,
      model,
      category,
      brand,
      stock,
      characteristics,
    };
    setPrinters((prevPrinters) => [...prevPrinters, newPrinter]);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Agregar Impresora
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Campo Número */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Número
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Número de inventario"
                required
              />
            </div>

            {/* Campo Número de Serie */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Número de Serie
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Número de serie"
                required
              />
            </div>

            {/* Campo Modelo */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Modelo
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Modelo de la impresora"
                required
              />
            </div>

            {/* Campo Categoría */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Categoría
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Categoría"
                required
              />
            </div>

            {/* Campo Marca */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Marca
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Marca de la impresora"
                required
              />
            </div>

            {/* Campo Stock */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Existencia
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Cantidad en existencia"
                required
              />
            </div>

            {/* Campo Estado */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Estado
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none p-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent text-gray-600"
                >
                  <option value="">Activo</option>
                  <option value="Multifuncional">Inactivo</option>
                  <option value="Laser">Mantenimiento</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Campo Características */}
            <div className="col-span-2">
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Características
              </label>
              <textarea
                value={characteristics}
                onChange={(e) => setCharacteristics(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Características de la impresora"
                required
              />
            </div>
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
              Agregar Impresora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
