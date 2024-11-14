"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

function AddProductModal({ products, setProducts, closeModal, productToEdit }) {
  const [modelo, setModelo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [tipo, setTipo] = useState("");
  const [existencia, setExistencia] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Populate form fields if editing
  useEffect(() => {
    console.log("productToEdit changed:", productToEdit);
    if (productToEdit) {
      setModelo(productToEdit.modelo || "");
      setCategoria(productToEdit.categoria || "");
      setMarca(productToEdit.marca || "");
      setTipo(productToEdit.tipo || "");
      setExistencia(productToEdit.existencia || "");
      setCaracteristicas(productToEdit.caracteristicas || "");
    } else {
      setModelo("");
      setCategoria("");
      setMarca("");
      setTipo("");
      setExistencia("");
      setCaracteristicas("");
    }
  }, [productToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const productData = {
      modelo,
      categoria,
      marca,
      tipo,
      existencia,
      caracteristicas,
    };

    try {
      let response;
      if (productToEdit) {
        // Edit product
        response = await fetch(
          `https://backend-integradora.vercel.app/api/productos/${productToEdit.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
      } else {
        // Add new product
        response = await fetch(
          "https://backend-integradora.vercel.app/api/productos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
      }

      if (response.ok) {
        const result = await response.json();
        if (productToEdit) {
          setSuccessMessage(`Product updated with ID: ${result.product.id}`);
          setProducts((prev) =>
            prev.map((p) => (p.id === result.product.id ? result.product : p))
          );
        } else {
          setSuccessMessage(`Product added with ID: ${result.product.id}`);
          setProducts((prev) => [...prev, result.product]);
        }
        closeModal();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save product");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Agregar Producto
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Campo Modelo */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Modelo
              </label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Modelo de la impresora"
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
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Marca de la impresora"
                required
              />
            </div>

            {/* Campo Categoría */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Categoría
              </label>
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full appearance-none p-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent text-gray-600"
                >
                  <option value="Impresora">Impresora</option>
                  <option value="Multifuncional">Multifuncional</option>
                  <option value="Laser">Escáner</option>
                  <option value="Toner">Toner</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Campo Tipo */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Tipo
              </label>
              <div className="relative">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full appearance-none p-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d57d1] focus:border-transparent text-gray-600"
                >
                  <option value="Impresora">Impresora</option>
                  <option value="Escáner">Escáner</option>
                  <option value="Suministro">Suministro</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Campo Existencia */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Existencia
              </label>
              <input
                type="number"
                value={existencia}
                onChange={(e) => setExistencia(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Cantidad en existencia"
                required
              />
            </div>

            {/* Campo Características */}
            <div className="col-span-2">
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Características
              </label>
              <textarea
                value={caracteristicas}
                onChange={(e) => setCaracteristicas(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d57d1]"
                placeholder="Características del producto"
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
              Agregar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
