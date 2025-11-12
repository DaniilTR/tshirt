// backend/routes/creators.js
const express = require('express');
const router = express.Router();
const pool = require('../bd');
 

// Получить всех ютуберов
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, username, channel_name AS name, channel_subscribers AS subscribersCount, 
              avatar_url AS avatar, bio AS description
       FROM users 
       WHERE user_type = 'youtuber'`
    );

    // Преобразуем данные в формат, удобный фронту
    const creators = rows.map(row => ({
      id: row.id,
      name: row.name || row.username,
      realName: row.username,
      avatar: row.avatar,
      subscribers: formatSubscribers(row.subscribersCount), // например "111M"
      subscribersCount: row.subscribersCount,
      description: row.description,
      country: "Неизвестно", // можешь потом добавить в БД
      category: "Разное",
      joinedDate: "2025",
      isVerified: true,
      stats: {
        products: 0,
        totalSales: "0",
        rating: 0,
        reviews: 0
      },
      tags: []
    }));

    res.json(creators);
  } catch (err) {
    console.error("Ошибка получения ютуберов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// функция для преобразования 111000000 -> "111M"
function formatSubscribers(count) {
  if (count >= 1000000) return Math.floor(count / 1000000) + "M";
  if (count >= 1000) return Math.floor(count / 1000) + "K";
  return count.toString();
}

module.exports = router;
