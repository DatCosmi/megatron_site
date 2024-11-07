"use client";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Productos = () => {
  const router = useRouter();
  const [isShrunk, setIsShrunk] = useState(false);
  const [filter, setFilter] = useState({
    name: "",
    price: "",
    category: "",
  });

  const handleScroll = () => {
    setIsShrunk(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [refProducts, inViewProducts] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(filter.name.toLowerCase());
    const matchesPrice =
      filter.price === "" || product.price <= parseFloat(filter.price);
    const matchesCategory =
      filter.category === "" || product.category === filter.category;

    return matchesName && matchesPrice && matchesCategory;
  });

  // Función para formatear el precio
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <main>
      {/* Hero Section */}
      <section
        className={`${
          isShrunk ? "h-[20vh]" : "h-[40vh]"
        } bg-gradient-to-r from-blue-700 to-blue-900 sect1 transition-all duration-500 flex items-center justify-center`}
      >
        <h1
          ref={ref1}
          className={`text-4xl font-bold text-white transform transition-all duration-1000 delay-200
          ${
            inView1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          Catálogo de Productos
        </h1>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Buscar por nombre"
              value={filter.name}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="price"
              placeholder="Precio máximo"
              value={filter.price}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded"
            />
            <select
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Todas las categorías</option>
              <option value="suministros">Suministros</option>
              <option value="multifuncionales">Multifuncionales</option>
              <option value="toner">Toner</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        ref={refProducts}
        className={`py-16 bg-white transform transition-all duration-1000 ${
          inViewProducts
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Descubre nuestros productos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link
                href={`/productos/${product.id}`}
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4 rounded-md"
                />
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-blue-700 font-bold text-lg mb-4">
                  ${formatPrice(product.price)}
                </p>
                <button className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition duration-300">
                  Ver detalles
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Productos;
