-- ========================================
-- Дамп базы данных MixPC Store (MySQL/MariaDB)
-- Версия 2: Сначала таблицы, потом связи
-- ========================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- ========================================
-- СОЗДАНИЕ ТАБЛИЦ (БЕЗ FOREIGN KEY)
-- ========================================

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица категорий товаров
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица товаров
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `brand` VARCHAR(100),
  `image_filename` VARCHAR(255),
  `specs` JSON,
  `is_popular` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `stock_quantity` INT DEFAULT 0,
  `stock_status` VARCHAR(20) DEFAULT 'in_stock',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица заказов
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `delivery_type` VARCHAR(20) NOT NULL,
  `delivery_address` TEXT,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица товаров в заказе
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT,
  `product_id` INT,
  `product_name` VARCHAR(255) NOT NULL,
  `product_price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица характеристик товаров
CREATE TABLE IF NOT EXISTS `product_specifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT,
  `spec_key` VARCHAR(100) NOT NULL,
  `spec_value` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица сборок ПК
CREATE TABLE IF NOT EXISTS `pc_builds` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `build_name` VARCHAR(255) NOT NULL,
  `total_price` DECIMAL(10, 2) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица компонентов сборки
CREATE TABLE IF NOT EXISTS `pc_build_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `build_id` INT,
  `product_id` INT,
  `component_type` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `build_id` (`build_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица избранного
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `product_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product_unique` (`user_id`, `product_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица корзины
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `product_id` INT,
  `quantity` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица сообщений от пользователей
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица ответов на сообщения
CREATE TABLE IF NOT EXISTS `message_replies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `message_id` INT,
  `reply_text` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `message_id` (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- ДОБАВЛЕНИЕ FOREIGN KEY (СВЯЗЕЙ)
-- ========================================

-- Связи для products
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` 
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`);

-- Связи для orders
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` 
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);

-- Связи для order_items
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` 
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` 
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);

-- Связи для product_specifications
ALTER TABLE `product_specifications`
  ADD CONSTRAINT `fk_product_specifications_product` 
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;

-- Связи для pc_builds
ALTER TABLE `pc_builds`
  ADD CONSTRAINT `fk_pc_builds_user` 
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);

-- Связи для pc_build_items
ALTER TABLE `pc_build_items`
  ADD CONSTRAINT `fk_pc_build_items_build` 
  FOREIGN KEY (`build_id`) REFERENCES `pc_builds`(`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pc_build_items_product` 
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);

-- Связи для favorites
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorites_user` 
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  ADD CONSTRAINT `fk_favorites_product` 
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);

-- Связи для cart_items
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cart_items_user` 
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  ADD CONSTRAINT `fk_cart_items_product` 
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);

-- Связи для message_replies
ALTER TABLE `message_replies`
  ADD CONSTRAINT `fk_message_replies_message` 
  FOREIGN KEY (`message_id`) REFERENCES `contact_messages`(`id`) ON DELETE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- ========================================
-- СХЕМА СВЯЗЕЙ
-- ========================================
-- 
--           users
--          /  |  \  \
--         /   |   \  \
--    orders pc_builds favorites cart_items
--       |       |         |         |
--  order_items  |    (products)  (products)
--              |
--        pc_build_items
--              |
--         (products)
--              |
--     product_specifications
--              |
--        (categories)
--
-- contact_messages
--        |
--  message_replies
