import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateBook } from '../api/apiService';

const EditBookModal = ({ isOpen, onClose, onRefresh, book }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        cover_image: ''
    });

    // Seçilen kitap değiştikçe formun içini doldur
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                price: book.price,
                cover_image: book.cover_image || ''
            });
        }
    }, [book]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBook(book.id, formData);
            onRefresh(); // Listeyi yenile
            onClose();   // Modalı kapat
        } catch (error) {
            alert("Güncelleme sırasında hata oluştu reis!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Edit Book Information</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                        <input
                            required
                            type="text"
                            className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                        <input
                            required
                            type="text"
                            className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₺)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all mt-4"
                    >
                        Update Inventory Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBookModal;