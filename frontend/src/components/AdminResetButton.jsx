import { resetToGoldenState } from '../api/apiService';

const AdminResetButton = ({ onResetSuccess }) => {
  const handleReset = async () => {
    if (window.confirm("Sistemi sıfırlamak istiyor musunuz?")) {
      try {
        await resetToGoldenState();
        onResetSuccess();
      } catch (error) {
        alert("Resetleme sırasında bir hata oluştu!");
      }
    }
  };

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-6 right-6 px-4 py-2 border border-gray-400 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors shadow-sm"
    >
      Admin Reset
    </button>
  );
};

export default AdminResetButton;