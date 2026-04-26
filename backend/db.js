const { Pool } = require('pg');
require('dotenv').config();

// Pool kullanıyoruz çünkü birden fazla sorgu için daha performanslıdır
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('Neon PostgreSQL veritabanına bağlanıldı kral!');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};