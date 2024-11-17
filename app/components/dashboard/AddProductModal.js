"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { token } from "../../components/protectedRoute";

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
    if (productToEdit && Object.keys(productToEdit).length > 0) {
      setModelo(productToEdit.modelo || productToEdit.Modelo || "");
      setCategoria(productToEdit.categoria || productToEdit.Categoria || "");
      setMarca(productToEdit.marca || productToEdit.Marca || "");
      setTipo(productToEdit.tipo || productToEdit.Tipo || "");
      setExistencia(productToEdit.existencia || productToEdit.Existencia || "");
      setCaracteristicas(
        productToEdit.caracteristicas || productToEdit.Caracteristicas || ""
      );
    }
  }, [productToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Datos del producto a enviar
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
        // Editar producto existente
        response = await fetch(
          `https://backend-integradora.vercel.app/api/productos/${productToEdit.idProductos}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          }
        );
      } else {
        // Agregar nuevo producto
        response = await fetch(
          "https://backend-integradora.vercel.app/api/productos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Error al guardar el producto");
      }

      // Obtener el resultado de la respuesta
      const result = await response.json();

      if (productToEdit) {
        // Actualizar el producto editado en el estado
        setSuccessMessage(`Producto actualizado con ID: ${result.product.id}`);
        setProducts((prev) =>
          prev.map((p) => (p.id === result.product.id ? result.product : p))
        );
      } else {
        // Agregar el nuevo producto al estado
        setSuccessMessage(`Producto agregado con ID: ${result.product.id}`);
        setProducts((prev) => [...prev, result.product]);
      }

      // Cerrar el modal y limpiar los campos si es necesario
      closeModal();
    } catch (error) {
      setError(error.message || "Algo salió mal");
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {productToEdit ? "Editar Producto" : "Agregar Producto"}
        </h2>

        {/* Alerta de éxito */}
        {successMessage && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        {/* Alerta de error */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

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
              className="px-6 py-3 bg-[#2d57d1] text-white rounded-lg text-sm font-medium hover:bg-[#1a42b6] focus:outline-none focus:ring-2 focus:ring-[#1a42b6]"
            >
              {productToEdit ? "Guardar Cambios" : "Agregar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
