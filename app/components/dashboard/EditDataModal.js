const EditDataModal = ({
  formData,
  setFormData,
  handleUpdateData,
  onClose,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-xl font-bold mb-4">Editar Datos</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        className="w-full p-2 border rounded-lg mb-4"
      />
      <input
        type="text"
        placeholder="Apellido Paterno"
        value={formData.apellidoPa}
        onChange={(e) =>
          setFormData({ ...formData, apellidoPa: e.target.value })
        }
        className="w-full p-2 border rounded-lg mb-4"
      />
      <input
        type="text"
        placeholder="Apellido Materno"
        value={formData.apellidoMa}
        onChange={(e) =>
          setFormData({ ...formData, apellidoMa: e.target.value })
        }
        className="w-full p-2 border rounded-lg mb-4"
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        className="w-full p-2 border rounded-lg mb-4"
      />
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={formData.correoElectronico}
        onChange={(e) =>
          setFormData({ ...formData, correoElectronico: e.target.value })
        }
        className="w-full p-2 border rounded-lg mb-4"
      />
      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="py-2 px-4 bg-gray-500 text-white rounded-lg"
        >
          Cancelar
        </button>
        <button
          onClick={handleUpdateData}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg"
        >
          Actualizar
        </button>
      </div>
    </div>
  </div>
);

export default EditDataModal;
