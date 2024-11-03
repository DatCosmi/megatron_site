// components/Footer.js
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Horario de Atención</h3>
            <p>Lun - Vie: 09:00 - 19:00</p>
            <p>Sábado: 10:00 - 14:00</p>
            <p>Domingo: Cerrado</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p>Tel: 618-825-3884</p>
            <p>Email: contacto@megatron.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">
                <span className="sr-only">Facebook</span>
                {/* Add Facebook icon */}
              </a>
              <a href="#" className="hover:text-red-400">
                <span className="sr-only">YouTube</span>
                {/* Add YouTube icon */}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>
            &copy; {new Date().getFullYear()} Megatron. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
