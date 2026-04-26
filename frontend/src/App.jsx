import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AdminResetButton from './components/AdminResetButton';
import api, { fetchBooks } from './api/apiService';
import BookTable from './components/BookTable';
import AddBookModal from './components/AddBookModal';
import EditBookModal from './components/EditBookModal';
import RevenueChart from './components/RevenueChart';
import AuthScreen from './components/AuthScreen';

function App() {
  // --- 1. STATE YÖNETİMİ ---
  const [books, setBooks] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');

  // Modal Kontrolleri
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  // Sepet Mantığı
  const [cart, setCart] = useState([]);
  // 1. ADIM: Kullanıcı her değiştiğinde (Login/Logout) sepeti localStorage'dan çek
  useEffect(() => {
    if (user) {
      // Sadece bu kullanıcıya özel sepeti getir (Örn: cart_user1)
      const savedCart = localStorage.getItem(`cart_${user.username}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]); // Eğer bu kullanıcı için kayıt yoksa sepeti sıfırla
      }
    } else {
      // Kimse giriş yapmadıysa ekranı temizle (Güvenlik için)
      setCart([]);
    }
  }, [user]); // user state'i her değiştiğinde bu blok çalışır

  // 2. ADIM: Sepet her güncellendiğinde localStorage'ı tazele
  useEffect(() => {
    if (user && cart.length >= 0) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    }
  }, [cart, user]); // cart veya user değiştikçe kaydeder

  // --- 2. VERİ YÜKLEME (API) ---
  const loadBooks = async () => {
    try {
      const response = await fetchBooks();
      setBooks(response.data);
    } catch (error) { console.error("Kitaplar çekilemedi:", error); }
  };

  const loadRevenue = async () => {
    try {
      const response = await api.get('/revenue');
      setRevenueData(response.data);
    } catch (error) { console.error("Gelir verisi çekilemedi:", error); }
  };

  useEffect(() => {
    loadBooks();
    loadRevenue();
  }, []);

  // --- 3. AUTH (GİRİŞ/ÇIKIŞ) ---
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAdmin(userData.role === 'admin');
    setActiveTab('Home');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCart([]);
    setActiveTab('Home');
  };

  // --- 4. SEPET VE SATIŞ İŞLEMLERİ ---
  const addToCart = (book) => {
    setCart((prevCart) => {
      const isExisting = prevCart.find((item) => item.id === book.id);
      if (isExisting) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (bookId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === bookId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const handleCheckout = async () => {
    // 1. KORUMA: Eğer giriş yapmış bir kullanıcı yoksa
    if (!user) {
      alert("Önce giriş yapmalısın!");
      setActiveTab('Authors'); // Kullanıcıyı otomatik giriş ekranına fırlat
      return;
    }

    // 2. KORUMA: Sepet boşsa
    if (cart.length === 0) return alert("Sepet boş, önce kitap seç!");

    try {
      await api.post('/sales', { cartItems: cart });
      setCart([]);
      if (user) localStorage.removeItem(`cart_${user.username}`);
      await loadRevenue();
      alert("Satın alma başarılı! Dashboard güncellendi.");
    } catch (error) {
      alert("Ödeme yapılamadı!");
    }
  };

  // --- 5. CRUD (ADMİN) ---
  const handleEditInit = (book) => {
    setBookToEdit(book);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex bg-white min-h-screen">
      {/* SIDEBAR: Menüden Inventory'yi kaldırabilirsin, Home artık her şey! */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        cart={cart}
        onRemoveFromCart={(index) => setCart(cart.filter((_, i) => i !== index))}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-10 relative">

        {/* 1. AUTHORS SEKMESİ (Giriş/Profil Kapısı) */}
        {activeTab === 'Authors' && !user ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 italic">Join the Club</h1>
              <p className="text-gray-400 text-sm">Login to complete your purchase</p>
            </header>
            <AuthScreen onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <>
            {/* HEADER: Dinamik Başlık */}
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {activeTab === 'Home' ? 'Okuyan Horoz' : activeTab}
                </h1>
                <p className="text-gray-400 text-sm font-medium">
                  {user ? `Welcome back, ${user.username}` : 'Explore our collection and start reading'}
                </p>
              </div>

              {/* Admin Butonu artık Home sekmesinde de aktif */}
              {isAdmin && activeTab === 'Home' && (
                <button
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm font-semibold text-sm"
                  onClick={() => setIsAddBookModalOpen(true)}
                >
                  + Add New Book
                </button>
              )}
            </header>

            {/* --- ANA İÇERİK: HOME (ESKİ INVENTORY) --- */}
            {activeTab === 'Home' && (
              <>
                {/* Kitap Tablosu */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-8">
                  <BookTable
                    books={books}
                    isAdmin={isAdmin}
                    loadBooks={loadBooks}
                    onEdit={handleEditInit}
                    onAddToCart={addToCart}
                  />
                </div>

                {/* Grafik sadece Admin'e Home'da görünür */}
                {isAdmin && (
                  <div className="animate-in fade-in duration-1000">
                    <RevenueChart data={revenueData} />
                  </div>
                )}
              </>
            )}

            {/* AUTHORS SEKME (Giriş Yapılmışsa) */}
            {activeTab === 'Authors' && user && (
              <div className="p-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <h2 className="text-xl font-bold text-gray-700">Author Portal</h2>
                <p className="text-gray-400 mt-2">Manage your favorite authors and reviews here.</p>
              </div>
            )}

            {/* CART SEKME */}
            {activeTab === 'Cart' && (
              <div className="bg-gray-50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">
                  🛒
                </div>
                <h2 className="text-xl font-bold text-gray-700">Shopping Cart</h2>
                <p className="text-gray-400 mt-2">Check the sidebar to finalize your purchase.</p>
              </div>
            )}
          </>
        )}

        {/* ADMIN ARAÇLARI: Home sekmesinde de çalışacak şekilde güncellendi */}
        {isAdmin && activeTab === 'Home' && (
          <>
            <AdminResetButton onResetSuccess={() => { loadBooks(); loadRevenue(); }} />
            <AddBookModal isOpen={isAddBookModalOpen} onClose={() => setIsAddBookModalOpen(false)} onRefresh={loadBooks} />
            <EditBookModal
              isOpen={isEditModalOpen}
              book={bookToEdit}
              onClose={() => { setIsEditModalOpen(false); setBookToEdit(null); }}
              onRefresh={loadBooks}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;