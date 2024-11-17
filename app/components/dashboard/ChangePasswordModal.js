const ChangePasswordModal = ({
  passwordData,
  setPasswordData,
  handleUpdatePassword,
  onClose,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-xl font-bold mb-4">Cambiar Contraseña</h3>
      <input
        type="password"
        placeholder="Nueva Contraseña"
        value={passwordData.newPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, newPassword: e.target.value })
        }
        className="w-full p-2 border rounded-lg mb-4"
      />
      <input
        type="password"
        placeholder="Confirmar Contraseña"
        value={passwordData.confirmPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
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
          onClick={handleUpdatePassword}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg"
        >
          Actualizar
        </button>
      </div>
    </div>
  </div>
);

export default ChangePasswordModal;
