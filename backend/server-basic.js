// server.js - MySQL version
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MySQL Connection Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'tshirt_user',
    password: process.env.DB_PASSWORD || 'TshirtPass123!',
    database: process.env.DB_NAME || 'tshirtbd',
    charset: 'utf8mb4'
};

let db;

// Database connection
async function connectToDatabase() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('✅ Подключение к MySQL успешно');
        await initializeDatabase();
    } catch (error) {
        console.error('❌ Ошибка подключения к MySQL:', error.message);
        console.log('💡 Убедитесь что MySQL запущен: sudo systemctl start mysql');
        process.exit(1);
    }
}

// Initialize database tables
async function initializeDatabase() {
    try {
        // Users table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                user_type ENUM('customer', 'youtuber') NOT NULL DEFAULT 'customer',
                full_name VARCHAR(100),
                channel_name VARCHAR(100),
                channel_subscribers INT DEFAULT 0,
                avatar_url VARCHAR(255),
                bio TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Products table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                youtuber_id INT NOT NULL,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                image_url VARCHAR(255),
                category VARCHAR(100) DEFAULT 'T-shirt',
                sizes JSON,
                colors JSON,
                stock_quantity INT DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                rating DECIMAL(3, 2) DEFAULT 0.00,
                reviews_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (youtuber_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('✅ База данных инициализирована');
        await insertSampleData();
    } catch (error) {
        console.error('❌ Ошибка инициализации базы данных:', error.message);
    }
}

// Insert sample data
async function insertSampleData() {
    try {
        const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
        
        if (users[0].count === 0) {
            console.log('📝 Добавляем тестовых пользователей...');
            
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            await db.execute(`
                INSERT INTO users (username, email, password_hash, user_type, full_name, channel_name, channel_subscribers, bio)
                VALUES 
                ('danyatech', 'danya@example.com', ?, 'youtuber', 'Данил Техно', 'DanyaTech', 150000, 'Обзоры технологий и гаджетов'),
                ('mariafitness', 'maria@example.com', ?, 'youtuber', 'Мария Фитнес', 'MariaFit', 85000, 'Фитнес и здоровье'),
                ('alexgaming', 'alex@example.com', ?, 'youtuber', 'Алексей Геймер', 'AlexPlay', 220000, 'Игровой контент'),
                ('testuser', 'user@example.com', ?, 'customer', 'Тестовый Пользователь', NULL, 0, NULL)
            `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword]);
            
            console.log('✅ Тестовые данные добавлены');
        }
    } catch (error) {
        console.error('❌ Ошибка добавления тестовых данных:', error.message);
    }
}

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend работает!', 
        timestamp: new Date().toISOString(),
        database: 'MySQL connected'
    });
});

// Start server
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
        console.log(`📊 API доступен на http://localhost:${PORT}/api/`);
        console.log(`🧪 Тест: http://localhost:${PORT}/api/test`);
    });
});

module.exports = app;