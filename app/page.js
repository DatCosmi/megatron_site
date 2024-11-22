"use client";
import { useInView } from "react-intersection-observer";
import {
  PrinterIcon,
  CogIcon,
  WrenchIcon,
  ArrowRightIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { Youtube, Facebook } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "./components/header";
import Footer from "./components/footer";

const Home = () => {
  const [isShrunk, setIsShrunk] = useState(false);

  const handleScroll = () => {
    setIsShrunk(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref3, inView3] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref4, inView4] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref5, inView5] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref6, inView6] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [refAbout, inViewAbout] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const serviciosRef = useRef(null);
  const contactoRef = useRef(null);

  return (
      <main>
        <Header />
        {/* Hero Section */}
        <section
          className={`${
            isShrunk ? "h-[30vh]" : "h-screen"
          } bg-gradient-to-r from-blue-700 to-blue-900 sect1 transition-all duration-500`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 h-full flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div
                ref={ref1}
                className={`transform transition-all duration-1000 delay-200
          ${
            inView1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
          }`}
              >
                <h1 className="text-5xl font-extrabold text-white mb-8">
                  Venta y renta de impresoras y multifuncionales en Durango
                </h1>
                <p className="text-xl text-white mb-4">
                  ¡Contacta a{" "}
                  <span className="font-bold text-white">Megatrón</span>,
                  expertos en{" "}
                  <span className="font-bold text-white">
                    venta y renta de impresoras y multifuncionales
                  </span>
                  !
                </p>
                <p className="text-xl text-white mb-8">
                  Brindamos a nuestros clientes productos y servicios de calidad
                  superando continuamente sus expectativas, apoyados siempre de
                  nuestro profesional equipo de trabajo.
                </p>
                <Link href="/">
                  <button
                    className="bg-white text-blue-700 px-10 py-4 rounded-full text-lg font-bold 
                   hover:transform hover:scale-105
                   transition-all duration-300 flex items-center 
                   space-x-2 group shadow-lg hover:shadow-2xl"
                  >
                    <span>Saber más</span>
                    <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </div>

              <div
                className={`flex justify-center transform transition-all duration-1000 delay-400
          ${inView1 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              >
                <img
                  src="/printer.png"
                  alt="Impresora Profesional"
                  className="max-w-md w-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section
          ref={refAbout}
          className={`py-16 bg-gray-50 transform transition-all duration-1000 ${
            inViewAbout
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Sobre nosotros
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Experiencia",
                  content:
                    "Tenemos más de 20 años satisfaciendo de manera exitosa las necesidades de nuestros clientes pertenecientes a diferentes segmentos desde PyME's hasta entidades gubernamentales.",
                  image: "/megatron-logo.png",
                },
                {
                  title: "Misión",
                  content:
                    "Facilitar al cliente un servicio de arrendamiento y reparación de equipos multifuncionales de una forma rápida, dando solución a sus problemas de impresión, fotocopiado y digitalización.",
                  image: "/printer2.png",
                },
                {
                  title: "Visión",
                  content:
                    "Para el año 2025 alcanzar a expandir nuestras instalaciones, brindando nuestro servicio de arrendamiento y reparación de equipos multifuncionales a un mayor número de personas.",
                  image: "/printer-display.png",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-white p-8 rounded-lg shadow-lg transform transition-all duration-500 ${
                    inViewAbout
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  } delay-${index * 200}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-60 h-60 object-contain mb-6"
                    />
                    <h3 className="text-2xl font-semibold mb-4 text-blue-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" ref={serviciosRef} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Realizamos nuestros servicios a través de tres grupos de
              actividades
            </h2>

            <div ref={ref3} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <PrinterIcon className="w-20 h-20 text-blue-700" />,
                  title: "Comercialización equipos multifuncionales",
                  items: [
                    "Renta de equipo multifuncional",
                    "Venta de equipo multifuncional nuevo",
                    "Venta de equipo multifuncional medio uso",
                  ],
                },
                {
                  icon: <CogIcon className="w-20 h-20 text-blue-700" />,
                  title: "Venta de refacciones para equipos",
                  items: [
                    "Consumibles compatibles y originales",
                    "Partes de equipos",
                    "Refacciones de equipos multifuncionales",
                    "Remanufacturación de partes",
                  ],
                },
                {
                  icon: <WrenchIcon className="w-20 h-20 text-blue-700" />,
                  title: "Reparación de equipos multifuncionales",
                  items: [
                    "Reparación de impresoras",
                    "Reparación de equipos multifuncionales",
                    "Mantenimientos preventivos y de revisión",
                    "Visitas a domicilio para reparación",
                  ],
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl
                          transform hover:-translate-y-2 transition-all duration-500
                          ${
                            inView3
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-10"
                          }
                          delay-${index * 200}`}
                >
                  <div className="flex flex-col items-center text-center">
                    {service.icon}
                    <h3 className="text-xl font-semibold my-4 text-gray-700">
                      {service.title}
                    </h3>
                    <ul className="space-y-2 text-gray-500">
                      {service.items.map((item, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-blue-700 rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brother Section */}
        <section className="bg-blue-600 py-16 transform transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <a href="https://www.brother.com.mx/" target="_blank">
              <img
                src="/brother-logo.png"
                alt="Brother"
                className="h-16 mx-auto mb-6 hover:scale-110 transition-transform duration-300 brt-logo"
              />
            </a>
            <h2 className="text-2xl font-bold mb-4">
              Centro de servicio autorizado Brother
            </h2>
            <p className="max-w-2xl mx-auto">
              ¡Más de 10 años siendo respaldados por la marca! Somos
              orgullosamente el centro de servicio mejor evaluado año con año y
              con los técnicos mejor capacitados.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" ref={contactoRef} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div
                ref={ref5}
                className={`transform transition-all duration-1000 delay-200
                ${
                  inView5
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-20"
                }`}
              >
                <h2 className="text-3xl font-bold mb-8">
                  Información de Contacto
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPinIcon className="w-6 h-6 text-blue-700 mt-1" />
                    <div>
                      <h3 className="font-semibold">Dirección</h3>
                      <p className="text-gray-600">
                        AV. 5 DE FEBRERO #1206 BUROCRATA, DURANGO, DURANGO 34279
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <ClockIcon className="w-6 h-6 text-blue-700 mt-1" />
                    <div>
                      <h3 className="font-semibold">Horario</h3>
                      <p className="text-gray-600">Lun - Vie: 09:00 - 19:00</p>
                      <p className="text-gray-600">Sábado: 10:00 - 14:00</p>
                      <p className="text-gray-600">Domingo: Cerrado</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <PhoneIcon className="w-6 h-6 text-blue-700 mt-1" />
                    <div>
                      <h3 className="font-semibold">Teléfonos</h3>
                      <p className="text-gray-600">618-825-3884</p>
                      <p className="text-gray-600">618-825-3885</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <EnvelopeIcon className="w-6 h-6 text-blue-700 mt-1" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">copimegatron@hotmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div
                ref={ref5}
                className={`transform transition-all duration-1000 delay-400
                ${
                  inView5
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-20"
                }`}
              >
                <h2 className="text-3xl font-bold mb-8">¡Contáctanos!</h2>

                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Teléfono:
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mensaje:
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-700 text-white px-6 py-3 rounded-md
                           hover:bg-blue-700 transform hover:scale-105
                           transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
            {/* Google Maps Integration */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Nuestra Ubicación</h3>
              <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.13716155819!2d-104.65316482377109!3d24.02622787812962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x869bb7dd86792373%3A0x73d6aca324532cdf!2sMegatron%20(COPIMEGATRON)!5e0!3m2!1ses!2smx!4v1730598549777!5m2!1ses!2smx"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={ref6}
              className={`text-center transform transition-all duration-1000
              ${
                inView6
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold mb-8">
                Síguenos en Redes Sociales
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                Mantente al día con nuestras últimas novedades y servicios
              </p>

              <div className="flex justify-center space-x-8">
                <a
                  href="https://www.facebook.com/Copimegatron"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center transition-transform hover:scale-110"
                >
                  <div
                    className="bg-blue-600 text-white p-4 rounded-full mb-3 
                              group-hover:shadow-lg transition-all duration-300"
                  >
                    <Facebook className="w-8 h-8" />
                  </div>
                  <span className="text-gray-600 font-medium">Facebook</span>
                </a>

                <a
                  href="https://www.youtube.com/channel/UC8dCtubf2HdnV4PhMSd89nA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center transition-transform hover:scale-110"
                >
                  <div
                    className="bg-red-600 text-white p-4 rounded-full mb-3 
                              group-hover:shadow-lg transition-all duration-300"
                  >
                    <Youtube className="w-8 h-8" />
                  </div>
                  <span className="text-gray-600 font-medium">YouTube</span>
                </a>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="font-semibold text-xl mb-4">
                    Síguenos en Facebook
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Mantente informado de nuestras promociones y novedades
                  </p>
                  <a
                    href="https://www.facebook.com/Copimegatron"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-2"
                  >
                    <span>Visitar página</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="font-semibold text-xl mb-4">
                    Síguenos en YouTube
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tutoriales y contenido exclusivo sobre nuestros productos
                  </p>
                  <a
                    href="https://www.youtube.com/channel/UC8dCtubf2HdnV4PhMSd89nA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 font-medium inline-flex items-center space-x-2"
                  >
                    <span>Ver canal</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>                           
  );  
};

export default Home;
