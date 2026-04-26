import { Edit, Trash2, ShoppingCart } from 'lucide-react';
import { deleteBook } from '../api/apiService';

const BookTable = ({ books, isAdmin, loadBooks, onEdit, onAddToCart }) => {

  const handleDelete = async (id) => {
    if (window.confirm("Bu kitabı silmek istediğine emin misin reis?")) {
      try {
        await deleteBook(id);
        loadBooks();
      } catch (err) {
        alert("Silme işlemi başarısız oldu!");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">Book List</th>
            <th className="py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">Authors</th>
            <th className="py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">Price</th>
            <th className="py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">Cover</th>
            <th className="py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">

              {/* Kitap Bilgisi - SADECE BAŞLIK KALDI */}
              <td className="py-4 px-4">
                <div className="font-medium text-gray-800 text-base">{book.title}</div>
                {/* ID satırı buradan silindi kral, artık tertemiz! */}
              </td>

              {/* Yazar Bilgisi */}
              <td className="py-4 px-4 text-gray-600">
                {book.author}
              </td>

              {/* Fiyat Bilgisi */}
              <td className="py-4 px-4 font-bold text-gray-900">
                ₺{parseFloat(book.price).toFixed(2)}
              </td>

              {/* Kapak Görseli */}
              <td className="py-4 px-4">
                <div className="w-10 h-14 bg-gray-100 rounded-lg shadow-sm overflow-hidden flex items-center justify-center border border-gray-200">
                  {/* Kontrolü daha esnek yapıyoruz: Link 'http' ile başlıyorsa göster */}
                  {book.cover_image && book.cover_image.startsWith('http') ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-gray-400 italic font-medium">No Cover</span>
                  )}
                </div>
              </td>

              {/* Aksiyon Butonları */}
              <td className="py-4 px-4">
                {isAdmin ? (
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(book)} className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 transition-all">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(book.id)} className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(book)}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all font-bold text-xs shadow-sm active:scale-95"
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {books.length === 0 && (
        <div className="p-20 text-center text-gray-400 bg-gray-50/50 italic">
          Kütüphane şu an boş görünüyor.
        </div>
      )}
    </div>
  );
};

export default BookTable;