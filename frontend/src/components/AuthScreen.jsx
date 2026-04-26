import { useState } from 'react';
import api from '../api/apiService';

const AuthScreen = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'buyer' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/login' : '/register';
            const response = await api.post(endpoint, formData);
            onLoginSuccess(response.data); // Kullanıcı verisini yukarı gönder
            alert(`${isLogin ? 'Giriş' : 'Kayıt'} başarılı!`);
        } catch (err) {
            alert(err.response?.data?.error || "Bir hata oluştu!");
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl max-w-md mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    required
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <input
                    required
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                {!isLogin && (
                    <div className="flex gap-4 p-2 bg-gray-50 rounded-xl">
                        <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-2 rounded-lg has-[:checked]:bg-white has-[:checked]:shadow-sm">
                            <input type="radio" name="role" value="buyer" checked={formData.role === 'buyer'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
                            <span className="text-xs font-bold">Buyer</span>
                        </label>
                        <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-2 rounded-lg has-[:checked]:bg-white has-[:checked]:shadow-sm">
                            <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
                            <span className="text-xs font-bold text-red-600">Admin</span>
                        </label>
                    </div>
                )}

                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                    {isLogin ? 'Sign In' : 'Register Now'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">
                    {isLogin ? 'Register' : 'Login'}
                </button>
            </p>
        </div>
    );
};

export default AuthScreen;