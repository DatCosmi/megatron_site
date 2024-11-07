"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ProductDetail = ({ params }) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const products = [
    {
      id: 1,
      name: "Multifuncional Láser Brother DCP-L5650DN",
      description: "Ideal para oficinas pequeñas y medianas.",
      fullDescription:
        'El Multifuncional Láser Brother DCP-L5650DN es perfecto para entornos de trabajo exigentes. Ofrece impresión dúplex automática, velocidades de hasta 42 páginas por minuto y una bandeja de papel de alta capacidad. Su pantalla táctil de 3.7" facilita la navegación entre funciones.',
      price: 11020,
      category: "multifuncionales",
      image: "/product1.png",
      specifications: [
        "Velocidad de impresión: 42 ppm",
        "Resolución: Hasta 1200 x 1200 dpi",
        "Capacidad de papel: 520 hojas",
        "Conectividad: USB, Ethernet, WiFi",
      ],
    },
    {
      id: 2,
      name: "Toner Original TN-890",
      description: "Cartucho original de alta calidad.",
      fullDescription:
        "El Toner Original TN-890 garantiza impresiones nítidas y de alta calidad. Diseñado específicamente para las impresoras Brother, este cartucho ofrece un rendimiento excepcional y una fácil instalación.",
      price: 2610,
      category: "suministros",
      image: "/product2.png",
      specifications: [
        "Rendimiento: Hasta 3000 páginas",
        "Tipo de toner: Original",
        "Compatibilidad: Brother DCP, MFC, HL",
      ],
    },
    {
      id: 3,
      name: "Escáner Digital",
      description: "Escáner de alta precisión y velocidad.",
      fullDescription:
        "El Escáner Digital ofrece alta precisión y velocidad para digitalizar documentos rápidamente. Ideal para oficinas que necesitan escanear grandes volúmenes de documentos.",
      price: 800,
      category: "multifuncionales",
      image: "/product3.png",
      specifications: [
        "Velocidad de escaneo: 25 ppm",
        "Resolución: Hasta 600 x 600 dpi",
        "Formato de salida: PDF, JPEG",
        "Conectividad: USB",
      ],
    },
  ];

  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-5">
      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-10">
          {/* Navegación */}
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center">
            <Link
              href="/productos"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Regresar
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Imagen del producto */}
            <div className="flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full h-auto object-contain rounded-lg"
              />
            </div>

            {/* Detalles del producto */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="text-2xl font-semibold text-blue-600 mb-6">
                ${formatPrice(product.price)}
              </div>
              <p className="text-gray-700 mb-6">{product.fullDescription}</p>

              {/* Especificaciones */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Especificaciones:
                </h2>
                <ul className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="mr-2">•</span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón de cotización */}
              <button
                onClick={() => setShowQuoteForm(!showQuoteForm)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>

        {/* Formulario de cotización */}
        {showQuoteForm && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">
              Solicitar Cotización
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Tu teléfono"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Mensaje</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="4"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Enviar Solicitud
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
