// ================== ИМПОРТЫ ==================
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const creatorsRoutes = require('./routes/creators');
const security = require('./middleware/security');

const encryption = require('./middleware/encryption');

// ================== НАСТРОЙКА APP ==================
const app = express();

// ======= MIDDLEWARE =======

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// ======= API ROUTES =======
app.use("/api/creators", creatorsRoutes);

// Security middleware
app.use(encryption.decryptRequest);  // дешифровка входящих данных
app.use(encryption.encryptResponse); // шифрование исходящих данных

app.use(security.securityHeaders);
app.use(security.rateLimitGeneral);
app.use(security.pathTraversalProtection);
app.use(security.sqlInjectionProtection);
app.use(security.xssProtection);

app.use('/uploads', express.static('uploads'));
// ================== КОНСТАНТЫ ==================
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


// ================== ПОДКЛЮЧЕНИЕ К БД ==================
let db;
(async () => {
    try {
        // Поддерживаем разные имена переменных окружения для пароля
        const dbPassword = process.env.DB_PASSWORD || process.env.DB_PASS || 'TshirtPass123!';

        // Опциональная SSL-конфигурация
        let sslOption;
        if (process.env.DB_SSL_CA) {
            try {
                const ca = fs.readFileSync(process.env.DB_SSL_CA);
                sslOption = { ca };
                console.log('🔒 Используется SSL CA для подключения к БД:', process.env.DB_SSL_CA);
            } catch (e) {
                console.warn('⚠️  Переменная DB_SSL_CA задана, но файл не прочитан:', process.env.DB_SSL_CA, e.message);
                // Не прерываем — продолжим без sslOption
            }
        } else if (process.env.DB_REQUIRE_SSL === 'true' || process.env.DB_SSL === 'true') {
            // Если явно требуется SSL, но CA не передан, ставим rejectUnauthorized=false — это отключит проверку сертификата
            sslOption = { rejectUnauthorized: false };
            console.log('🔒 Используется SSL (без проверки CA) для подключения к БД');
        }

        db = await mysql.createPool(Object.assign({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'tshirt_user',
            password: dbPassword,
            database: process.env.DB_NAME || 'tshirtbd'
        }, sslOption ? { ssl: sslOption } : {}));

        console.log('✅ Подключение к MySQL успешно');
    } catch (err) {
        console.error('❌ Ошибка подключения к MySQL:', err);
        process.exit(1);
    }
})();
module.exports = db; 

// ================== MIDDLEWARE ==================

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недействительный токен' });
        }
        req.user = user;
        next();
    });
};

// Middleware для маршрутов только для YouTuber
const requireYouTuber = (req, res, next) => {
    if (req.user.user_type !== 'youtuber') {
        return res.status(403).json({ error: 'Доступ только для ютуберов' });
    }
    next();
};

// ================== ROUTES ==================

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, user_type, full_name, channel_name, channel_subscribers } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Логин, email и пароль обязательны' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
        }

        // Проверяем существует ли пользователь
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким логином или email уже существует' });
        }

        // Хэшируем пароль
        const passwordHash = await bcrypt.hash(password, 12);

        // Добавляем пользователя
        const [result] = await db.execute(`
            INSERT INTO users (username, email, password_hash, user_type, full_name, channel_name, channel_subscribers)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [username, email, passwordHash, user_type || 'customer', full_name, channel_name, channel_subscribers || 0]);

        const userId = result.insertId;

        // Генерация JWT
        const token = jwt.sign(
            { userId, username, user_type: user_type || 'customer' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Регистрация успешна',
            token,
            user: {
                id: userId,
                username,
                email,
                user_type: user_type || 'customer',
                full_name,
                channel_name
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ error: 'Ошибка сервера при регистрации' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Логин и пароль обязательны' });
        }

        // Находим пользователя
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        const user = users[0];

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        // Генерация JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, user_type: user.user_type },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Вход успешен',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                full_name: user.full_name,
                channel_name: user.channel_name,
                channel_subscribers: user.channel_subscribers
            }
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ error: 'Ошибка сервера при входе' });
    }
});

// ============ PRODUCTS ROUTES ============

// ✅ пример с async/await
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json({
      success: true,
      products: rows
    });
  } catch (error) {
    console.error("Ошибка получения товаров:", error);
    res.status(500).json({ error: "Ошибка сервера при получении товаров" });
  }
});

// ============ YOUTUBERS ROUTES ============

// Get all YouTubers
app.get('/api/youtubers', async (req, res) => {
    try {
        const [youtubers] = await db.execute(`
            SELECT u.id, u.username, u.channel_name, u.channel_subscribers, u.avatar_url, u.bio,
                   (SELECT COUNT(*) FROM products WHERE youtuber_id = u.id AND is_active = true) as products_count
            FROM users u
            WHERE u.user_type = 'youtuber'
            ORDER BY u.channel_subscribers DESC
        `);

        res.json({ 
            success: true,
            youtubers 
        });
    } catch (error) {
        console.error('Ошибка получения ютуберов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
// Get all Customers
app.get('/api/customers', async (req, res) => {
    try {
        const [customers] = await db.execute(`
            SELECT u.id, u.username, u.full_name, u.email, u.avatar_url, u.bio, u.created_at
            FROM users u
            WHERE u.user_type = 'customer'
            ORDER BY u.created_at DESC
        `);

        res.json({ 
            success: true,
            customers 
        });
    } catch (error) {
        console.error('Ошибка получения покупателей:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
// ================== STATIC FRONTEND ==================

// ================== START SERVER ==================
app.listen(PORT, () => {
    console.log(`🚀 Сервер работает на http://localhost:${PORT}`);
});
