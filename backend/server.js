const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- KİTAP İŞLEMLERİ (CRUD) ---

// Listeleme
app.get('/api/books', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Veri çekilemedi' });
    }
});

// Ekleme
app.post('/api/books', async (req, res) => {
    const { title, author, price, cover_image } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO books (title, author, price, cover_image) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, author, price, cover_image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Kitap eklenemedi!' });
    }
});

// Güncelleme
app.put('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, price, cover_image } = req.body;
    try {
        const result = await db.query(
            'UPDATE books SET title=$1, author=$2, price=$3, cover_image=$4 WHERE id=$5 RETURNING *',
            [title, author, price, cover_image, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Güncelleme başarısız!' });
    }
});

// Silme
app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM books WHERE id = $1', [id]);
        res.json({ message: 'Kitap başarıyla silindi!' });
    } catch (err) {
        res.status(500).json({ error: 'Silme işlemi başarısız!' });
    }
});

// ---  AUTH İŞLEMLERİ (LOGIN/REGISTER) ---

// Kayıt Ol
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, password, role || 'buyer']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Register hatası:", err);
        res.status(500).json({ error: 'Kullanıcı oluşturulamadı.' });
    }
});

// Giriş Yap
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Giriş denemesi:", username);
    try {
        const result = await db.query(
            'SELECT id, username, role FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(401).json({ error: 'Kullanıcı adı veya şifre yanlış!' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Giriş işlemi başarısız.' });
    }
});

// --- SATIŞ VE GELİR (SALES/REVENUE) ---

// Satın Alma (Adet Hesabı Dahil)
app.post('/api/sales', async (req, res) => {
    const { cartItems } = req.body;
    try {
        for (const item of cartItems) {
            const price = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ""));
            const qty = parseInt(item.quantity) || 1;
            const totalAmount = price * qty;

            await db.query(
                'INSERT INTO sales (book_id, amount, sale_date) VALUES ($1, $2, CURRENT_TIMESTAMP)',
                [item.id, totalAmount]
            );
        }
        res.json({ message: 'Satış başarıyla kaydedildi!' });
    } catch (err) {
        console.error("DB Satış Hatası:", err);
        res.status(500).json({ error: 'Veritabanına yazılamadı.' });
    }
});

// Gelir Grafiği Verisi
app.get('/api/revenue', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                TO_CHAR(TO_DATE(m::text, 'MM'), 'Mon') AS name,
                COALESCE(SUM(s.amount), 0) AS revenue
            FROM generate_series(1, 12) AS m
            LEFT JOIN sales s ON EXTRACT(MONTH FROM s.sale_date) = m 
                AND EXTRACT(YEAR FROM s.sale_date) IN (2025, 2026) 
            GROUP BY m
            ORDER BY m;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Revenue Sorgu Hatası:", err);
        res.status(500).json({ error: 'Gelir verisi çekilemedi.' });
    }
});

// --- SİSTEM (ADMIN RESET) ---

app.post('/api/admin/reset', async (req, res) => {
    try {
        await db.query('TRUNCATE TABLE sales, books RESTART IDENTITY CASCADE');
        const insertBooksQuery = `
            INSERT INTO books (title, author, price, cover_image) VALUES
            ('Saatleri Ayarlama Enstitüsü', 'Ahmet Hamdi Tanpınar', 185.00, 'https://img.kitapyurdu.com/v1/getImage/fn:11964184/wi:500/wh:fa194c3f1'),
            ('Benim Adım Kırmızı', 'Orhan Pamuk', 210.00, 'https://img.kitapyurdu.com/v1/getImage/fn:12040087/wh:0ecba62bb/miw:200/mih:200'),
            ('Beyaz Kale', 'Orhan Pamuk', 195.50, 'https://upload.wikimedia.org/wikipedia/tr/4/4b/Beyaz_Kale_kitap.jpg')
        `;
        await db.query(insertBooksQuery);

        const insertSalesQuery = `
            INSERT INTO sales (book_id, amount, sale_date) VALUES
            (1, 185.00, '2025-05-10'), (2, 420.00, '2025-05-15'),
            (1, 370.00, '2025-06-05'), (3, 586.50, '2025-06-25'),
            (1, 925.00, '2025-07-02'), (2, 1050.00, '2025-07-20'),
            (3, 195.50, '2025-08-12'), (1, 185.00, '2025-08-28'),
            (2, 630.00, '2025-09-05'), (1, 555.00, '2025-09-18'),
            -- EKİM BOŞ --
            (1, 370.00, '2025-11-10'), (3, 391.00, '2025-11-25'),
            (2, 1260.00, '2025-12-15'), (1, 925.00, '2025-12-28'),
            (3, 195.50, '2026-01-10'), (1, 370.00, '2026-01-22'),
            (2, 420.00, '2026-02-05'), (3, 391.00, '2026-02-18'),
            (1, 1110.00, '2026-03-05'), (2, 1680.00, '2026-03-15'),
            (1, 555.00, '2026-04-02'), (3, 782.00, '2026-04-10')
        `;
        await db.query(insertSalesQuery);

        res.json({ message: 'Sistem tertemiz ve veriler yüklendi!' });
    } catch (err) {
        console.error("RESET HATASI DETAYI:", err.message);
        res.status(500).json({ error: 'Reset başarısız: ' + err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend ${PORT} portunda hazır!`));