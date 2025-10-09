const crypto = require('crypto');

// Ключ и IV из переменных окружения
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 символа
const IV = process.env.ENCRYPTION_IV; // 16 символов

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY должен быть длиной 32 символа');
}
if (!IV || IV.length !== 16) {
  throw new Error('ENCRYPTION_IV должен быть длиной 16 символов');
}

// Функция шифрования совместимая с CryptoJS
function encryptData(data) {
  // Конвертируем в Buffer с кодировкой latin1 для совместимости
  const key = Buffer.from(ENCRYPTION_KEY, 'latin1');
  const iv = Buffer.from(IV, 'latin1');

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  // Шифруем данные
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
}

// Функция расшифровки совместимая с CryptoJS
function decryptData(encryptedData) {
  const key = Buffer.from(ENCRYPTION_KEY, 'latin1');
  const iv = Buffer.from(IV, 'latin1');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

// Middleware для дешифровки входящих JSON
function decryptRequest(req, res, next) {
  try {
    if (req.is('application/json') && req.body && typeof req.body === 'object' && req.body.encrypted) {
      req.body = decryptData(req.body.encrypted);
    }
    next();
  } catch (err) {
    console.error('Ошибка дешифровки запроса:', err);
    return res.status(400).json({ error: 'Некорректные зашифрованные данные' });
  }
}

// Middleware для шифрования ответов
function encryptResponse(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    try {
      const encrypted = encryptData(data);
      return originalJson.call(this, { encrypted });
    } catch (err) {
      console.error('Ошибка шифрования ответа:', err);
      return originalJson.call(this, { error: 'Ошибка шифрования данных' });
    }
  };
  next();
}

module.exports = { encryptData, decryptData, decryptRequest, encryptResponse };
