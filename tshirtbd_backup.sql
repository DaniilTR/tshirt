-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: tshirtbd
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `youtuber_id` int NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'T-shirt',
  `sizes` json DEFAULT NULL,
  `colors` json DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `rating` decimal(3,2) DEFAULT '0.00',
  `reviews_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `youtuber_id` (`youtuber_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`youtuber_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Футболка TheBrain Classic','Классическая футболка TheBrain',6000.00,'/images/tshirt/thebrain.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"black\", \"white\"]',50,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(2,1,'Футболка TheBrain Limited','Лимитированная версия футболки TheBrain',7500.00,'/images/tshirt/thebrain.png','T-shirt','[\"M\", \"L\", \"XL\"]','[\"black\"]',30,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(3,2,'Футболка Kuplinov Play Retro','Ретро стиль от Kuplinov Play',6500.00,'/images/tshirt/kypl.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"white\"]',40,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(4,2,'Футболка Kuplinov Play Pixel','Пиксельная версия футболки Kuplinov Play',7000.00,'/images/tshirt/kypl.png','T-shirt','[\"M\", \"L\"]','[\"black\"]',25,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(5,3,'Футболка IvanGai Energy','Футболка IvanGai в стиле Energy',6000.00,'/images/tshirt/iv1.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"blue\"]',50,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(6,3,'Футболка IvanGai Neon','Футболка IvanGai в неоновых цветах',6800.00,'/images/tshirt/iv1.png','T-shirt','[\"M\", \"L\", \"XL\"]','[\"green\"]',35,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(7,4,'Футболка MrBeast Logo','Футболка с логотипом MrBeast',8500.00,'/images/tshirt/mrbeast.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"blue\"]',70,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(8,4,'Футболка MrBeast Challenge','Футболка MrBeast Challenge Edition',9000.00,'/images/tshirt/mrbeast.png','T-shirt','[\"M\", \"L\", \"XL\"]','[\"black\"]',40,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(9,5,'Футболка PewDiePie Brofist','Футболка с символом Brofist',7500.00,'/images/tshirt/pewdiepie.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"red\"]',60,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(10,5,'Футболка PewDiePie Meme','Мемная футболка PewDiePie',7800.00,'/images/tshirt/pewdiepie.png','T-shirt','[\"M\", \"L\"]','[\"black\"]',35,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(11,6,'Футболка Dream Green','Футболка Dream в зеленом стиле',6200.00,'/images/tshirt/dream.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"green\"]',80,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(12,6,'Футболка Dream Smile','Футболка Dream с фирменной улыбкой',6700.00,'/images/tshirt/dream.png','T-shirt','[\"M\", \"L\", \"XL\"]','[\"white\"]',50,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(13,7,'Футболка A4 Vlad Fun','Футболка A4 с веселым принтом',5900.00,'/images/tshirt/a4.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"yellow\"]',90,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(14,7,'Футболка A4 Vlad Squad','Футболка A4 Vlad Squad Edition',6300.00,'/images/tshirt/a4.png','T-shirt','[\"M\", \"L\"]','[\"black\"]',60,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(15,8,'Футболка DanTDM Crystal','Футболка DanTDM Crystal Style',7000.00,'/images/tshirt/dantdm.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"blue\"]',40,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(16,8,'Футболка DanTDM Diamond','Футболка DanTDM Diamond Edition',7200.00,'/images/tshirt/dantdm.png','T-shirt','[\"M\", \"L\", \"XL\"]','[\"white\"]',30,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(17,9,'Футболка Ninja Blue','Фирменная синяя футболка Ninja',8000.00,'/images/tshirt/ninja.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"blue\"]',50,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(18,9,'Футболка Ninja Red','Красная версия футболки Ninja',8300.00,'/images/tshirt/ninja.png','T-shirt','[\"M\", \"L\", \"XL\"]','[\"red\"]',40,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(19,10,'Футболка KSI Prime','Футболка KSI Prime Edition',7600.00,'/images/tshirt/ksi.png','T-shirt','[\"S\", \"M\", \"L\"]','[\"black\"]',55,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21'),(20,10,'Футболка KSI Boxing','Футболка KSI Boxing Edition',8200.00,'/images/tshirt/ksi.png','T-shirt','[\"M\", \"L\", \"XL\"]','[\"white\"]',35,1,0.00,0,'2025-09-25 09:50:21','2025-09-25 09:50:21');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_type` enum('customer','youtuber') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel_subscribers` int DEFAULT '0',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'danyatech','danya@example.com','$2b$10$YUSjx6wGWMozSuYa41on8ObOg25YpvozLxRP7tYjiQjudPecUXC.y','youtuber','Данил Техно','DanyaTech',150000,NULL,'Обзоры технологий и гаджетов','2025-09-18 07:00:46','2025-09-18 07:00:46'),(2,'mariafitness','maria@example.com','$2b$10$YUSjx6wGWMozSuYa41on8ObOg25YpvozLxRP7tYjiQjudPecUXC.y','youtuber','Мария Фитнес','MariaFit',85000,NULL,'Фитнес и здоровье','2025-09-18 07:00:46','2025-09-18 07:00:46'),(3,'alexgaming','alex@example.com','$2b$10$YUSjx6wGWMozSuYa41on8ObOg25YpvozLxRP7tYjiQjudPecUXC.y','youtuber','Алексей Геймер','AlexPlay',220000,NULL,'Игровой контент','2025-09-18 07:00:46','2025-09-18 07:00:46'),(4,'testuser','user@example.com','$2b$10$YUSjx6wGWMozSuYa41on8ObOg25YpvozLxRP7tYjiQjudPecUXC.y','customer','Тестовый Пользователь',NULL,0,NULL,NULL,'2025-09-18 07:00:46','2025-09-18 07:00:46'),(5,'qwe@qwe','asdfghjkl228338@mail.ru','$2b$12$Dtb.HQ3/HgdG3MNLuN2NGec./475cZSEPUFdDZT3FqJxGab28DFDS','youtuber','Трофимов Даниил ','tr4fka',0,NULL,NULL,'2025-09-18 07:56:18','2025-09-18 07:56:18'),(6,'eeew','qwertyasd.228336@gmail.com','$2b$12$B5GoZSa0Y9YRC1r1NvDgDOTQ1.g5eXx9E1q.YH9.mepOuv6ccna2K','customer','Трофимов ','',0,NULL,NULL,'2025-09-18 09:52:45','2025-09-18 09:52:45'),(7,'testq','swadfsa@mail.ru','$2b$12$WB2H0G5TwEL.vmli.Q47x.87Fh8LK/OpO9stBKjO29chI677ahvS.','customer','тест персона','',0,NULL,NULL,'2025-09-18 10:43:55','2025-09-18 10:43:55'),(8,'pewdiepie','pewdiepie@example.com','$2b$10$CwTycUXWue0Thq9StjUM0uJ8x7rhWnTcxUo5c5aZT2kD2Jv7r0OFi','youtuber',NULL,'PewDiePie',111000000,'/images/creators/pewdiepie-avatar.jpg','Самый популярный индивидуальный ютубер в мире! Играю в игры, смотрю мемы.','2025-09-18 11:58:05','2025-09-18 11:58:05'),(9,'mrbeast','mrbeast@example.com','$2b$10$CwTycUXWue0Thq9StjUM0uJ8x7rhWnTcxUo5c5aZT2kD2Jv7r0OFi','youtuber',NULL,'MrBeast',123000000,'/images/creators/mrbeast-avatar.jpg','Делаю дорогие видео и раздаю деньги! Известен благотворительными проектами.','2025-09-18 11:58:05','2025-09-18 11:58:05'),(10,'dude-perfect','dudeperfect@example.com','$2b$10$CwTycUXWue0Thq9StjUM0uJ8x7rhWnTcxUo5c5aZT2kD2Jv7r0OFi','youtuber',NULL,'Dude Perfect',59000000,'/images/creators/dude-perfect-avatar.jpg','Невероятные трюки, спортивные челленджи и развлекательный контент.','2025-09-18 11:58:05','2025-09-18 11:58:05'),(11,'marques-brownlee','mkbhd@example.com','$2b$10$CwTycUXWue0Thq9StjUM0uJ8x7rhWnTcxUo5c5aZT2kD2Jv7r0OFi','youtuber',NULL,'Marques Brownlee',18000000,'/images/creators/mkbhd-avatar.jpg','Обзоры технологий, гаджетов и всего, что связано с tech-миром.','2025-09-18 11:58:05','2025-09-18 11:58:05'),(12,'emma-chamberlain','emma@example.com','$2b$10$CwTycUXWue0Thq9StjUM0uJ8x7rhWnTcxUo5c5aZT2kD2Jv7r0OFi','youtuber',NULL,'Emma Chamberlain',12000000,'/images/creators/emma-avatar.jpg','Lifestyle контент, влоги и все о повседневной жизни миллениала.','2025-09-18 11:58:05','2025-09-18 11:58:05'),(13,'kurzgesagt','kurzgesagt@example.com','$2b$10$CwTycUXWue0Thq9StjUM0uJ8x7rhWnTcxUo5c5aZT2kD2Jv7r0OFi','youtuber',NULL,'Kurzgesagt',20000000,'/images/creators/kurzgesagt-avatar.jpg','Образовательные видео о науке, космосе и философии с красивой анимацией.','2025-09-18 11:58:05','2025-09-18 11:58:05');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 16:29:36
