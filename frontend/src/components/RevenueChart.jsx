import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Artık 'data'yı prop olarak dışarıdan alıyoruz
const RevenueChart = ({ data }) => {

    // Eğer veri henüz gelmediyse veya boşsa şık bir yükleniyor/boş mesajı göster
    if (!data || data.length === 0) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mt-8 h-80 flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold text-gray-800 mb-4 self-start">Monthly Revenue</h2>
                <p className="text-gray-400 italic text-sm text-center">
                    Henüz satış verisi bulunamadı reis. <br />
                    Biraz alışveriş yapın da grafik canlansın!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Monthly Revenue</h2>
                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Real-time Sales Data</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                    <span className="text-xs font-bold text-gray-600">Earnings (₺)</span>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                        />
                        <Tooltip
                            cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            formatter={(value) => [`₺${parseFloat(value).toFixed(2)}`, 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorRev)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;