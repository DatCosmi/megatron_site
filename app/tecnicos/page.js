"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/dashboard/sidebar";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Trash2,
  SquarePen,
} from "lucide-react";
import AddProductModal from "../components/dashboard/AddProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState(products);
  const [loading, setLoading] = useState(true);
  const [productToEdit, setProductToEdit] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleEditClick = (product) => {
    setProductToEdit(product); // Set the product to edit
    setIsAddProductModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsAddProductModalOpen(false);
    fetchProducts();
    setProductToEdit(null);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://backend-integradora.vercel.app/api/productos"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products from the backend
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to handle delete action
  const handleDelete = async (productId) => {
    try {
      // Call the backend API to delete the product
      const response = await fetch(
        `https://backend-integradora.vercel.app/api/productos/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (type) {
      case "Impresora":
        return `${baseClasses} bg-blue-50 text-[#007bff] border border-blue-200`;
      case "Escáner":
        return `${baseClasses} bg-green-50 text-[#28a745] border border-green-200`;
      case "Suministro":
        return `${baseClasses} bg-yellow-50 text-[#ffc107] border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-800 border border-gray-200`;
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedProducts = () => {
    const filteredProducts = products.filter(
      (product) =>
        (categoryFilter === "" || product.Categoria === categoryFilter) &&
        (statusFilter === "" || product.Tipo === statusFilter) &&
        (product.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.idProductos.toString().includes(searchQuery.toLowerCase()))
    );

    if (!sortConfig.key) return filteredProducts;

    return filteredProducts.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Cálculo de los elementos de paginación
  const paginationRange = () => {
    const range = [];
    const delta = 2; // Número de páginas cercanas a mostrar
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage > 3) range.push("...");
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    if (currentPage < totalPages - 2) range.push("...");

    return [1, ...range, totalPages];
  };

  const sortedProducts = getSortedProducts();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex h-screen bg-[#eff1f6] ml-60">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-[#eff1f6]">
        <div className="dashboard space-y-6">
          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard de Productos
          </h1>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col w-full bg-white rounded-lg p-4">
            <div className="flex gap-3 w-[1190px]">
              {/* Search Input with Label */}
              <div className="relative flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Qué estás buscando?
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por modelo o ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="relative min-w-[140px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    <option value="Multifuncional">Multifuncional</option>
                    <option value="Impresora">Impresora</option>
                    <option value="Toner">Toner</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="relative min-w-[140px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="Impresora">Impresora</option>
                    <option value="Suministro">Suministro</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Add Product Button */}
              <div className="relative min-w-[100px] flex items-end">
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="p-2 bg-[#2d57d1] text-white rounded-lg hover:bg-[#1a42b6] transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table Header and Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-700">
                Productos
              </span>
            </div>

            {/* Pagination */}
            <div className="pagination flex items-center space-x-2 bg-white p-2 rounded-md shadow">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {paginationRange().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 text-sm rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 recent-orders">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("idProductos")}
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("modelo")}
                  >
                    Modelo
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("Categoria")}
                  >
                    Categoría
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("Marca")}
                  >
                    Marca
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("Tipo")}
                  >
                    Tipo
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("Existencia")}
                  >
                    Existencia
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="100%"
                      className="text-center py-4 text-gray-500"
                    >
                      Cargando productos...
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr key={product.idProductos} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.idProductos}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.modelo}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Categoria}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Marca}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <span className={getTypeBadge(product.Tipo)}>
                          {product.Tipo}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Existencia}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-xs flex">
                        <button
                          onClick={() => handleDelete(product.idProductos)}
                          className="text-[#ff006e] flex"
                        >
                          <Trash2 />
                        </button>
                        <button
                          className="text-[#007bff] flex"
                          onClick={() => handleEditClick(product)}
                        >
                          <SquarePen />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="100%"
                      className="text-center py-4 text-gray-500"
                    >
                      No hay productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for adding products */}
        {isAddProductModalOpen && (
          <AddProductModal
            productToEdit={productToEdit}
            setProducts={setProducts}
            closeModal={closeModal}
          />
        )}
      </main>
    </div>
  );
};

export default Products;
