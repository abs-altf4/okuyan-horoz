import { Home, Users, Package, ShoppingCart, BookOpen, LogOut, Trash2, CreditCard, Plus, Minus } from 'lucide-react';
import logo from '../assets/logo.png';
const Sidebar = ({ activeTab, setActiveTab, isAdmin, cart, onRemoveFromCart, onCheckout, user, onLogout, onUpdateQuantity }) => {

  const totalItemsCount = cart.length; const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  const menuItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Authors', icon: <Users size={20} /> },
    { name: 'Cart', icon: <ShoppingCart size={20} />, count: totalItemsCount },
  ];

  return (
    <aside className="w-72 h-screen bg-gray-50 border-r border-gray-100 flex flex-col p-5 sticky top-0">

      <div
        className="flex items-center gap-4 mb-12 px-2 cursor-pointer group"
        onClick={() => setActiveTab('Home')}
      >
        <div className="w-18 h-18 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex items-center justify-center p-1.5 transition-all group-hover:shadow-lg group-hover:scale-105">
          <img
            src={logo}
            alt="Okuyan Horoz"
            className="w-full h-full object-contain scale-[2.8]"
          />
        </div>

        <div className="flex flex-col">
          <span className="font-black text-2xl text-gray-900 tracking-tighter leading-[1.1]">
            Okuyan
          </span>
          <span className="font-black text-2xl text-blue-600 tracking-tighter leading-[1.1]">
            Horoz
          </span>
        </div>
      </div>

      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-150 font-medium ${activeTab === item.name
              ? 'bg-white text-blue-600 shadow-sm border border-gray-100'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
          >
            <div className="flex items-center gap-3.5">
              {item.icon}
              <span>{item.name}</span>
            </div>

            {item.name === 'Cart' && totalItemsCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {totalItemsCount}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* SEPET DETAY MENÜSÜ */}
      {activeTab === 'Cart' && (
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-6 overflow-hidden">
          <h3 className="font-bold text-gray-800 text-sm mb-4 border-b pb-2 flex items-center gap-2">
            <ShoppingCart size={16} /> Checkout Details
          </h3>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={item.id} className="border-b border-gray-50 pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-gray-800 leading-tight truncate w-32">{item.title}</p>
                    <span className="text-[10px] font-bold text-blue-600">₺{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-0.5 hover:bg-white rounded transition-all text-gray-500"><Minus size={12} /></button>
                      <span className="text-[11px] font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-0.5 hover:bg-white rounded transition-all text-gray-500"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => onRemoveFromCart(index)} className="text-gray-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-400 text-xs italic">Sepetiniz boş!</div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400 font-medium">Grand Total</span>
                <span className="text-base font-black text-gray-900">₺{cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={onCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
                <CreditCard size={14} /> Complete Purchase
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logout Kısmı */}
      <div className="mt-auto pt-5 border-t border-gray-100">
        {user ? (
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all"><LogOut size={18} />Logout</button>
        ) : (
          <button onClick={() => setActiveTab('Authors')} className="w-full flex items-center justify-center gap-3 p-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">Sign In</button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;