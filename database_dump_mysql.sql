-- ========================================
-- Дамп базы данных MixPC Store (MySQL/MariaDB)
-- Дата создания: 2025-12-09
-- ========================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Таблица пользователей
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица категорий товаров
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `icon` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица товаров
CREATE TABLE `products` (
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
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица заказов
CREATE TABLE `orders` (
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
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица товаров в заказе
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT,
  `product_id` INT,
  `product_name` VARCHAR(255) NOT NULL,
  `product_price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица характеристик товаров
CREATE TABLE `product_specifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT,
  `spec_key` VARCHAR(100) NOT NULL,
  `spec_value` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица сборок ПК
CREATE TABLE `pc_builds` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `build_name` VARCHAR(255) NOT NULL,
  `total_price` DECIMAL(10, 2) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица компонентов сборки
CREATE TABLE `pc_build_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `build_id` INT,
  `product_id` INT,
  `component_type` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`build_id`) REFERENCES `pc_builds`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица избранного
CREATE TABLE `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `product_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product_unique` (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица корзины
CREATE TABLE `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `product_id` INT,
  `quantity` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица сообщений от пользователей
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица ответов на сообщения
CREATE TABLE `message_replies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `message_id` INT,
  `reply_text` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`message_id`) REFERENCES `contact_messages`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

-- ========================================
-- ДИАГРАММА СВЯЗЕЙ МЕЖДУ ТАБЛИЦАМИ
-- ========================================
-- users (1) ──→ (N) orders
-- users (1) ──→ (N) pc_builds
-- users (1) ──→ (N) favorites
-- users (1) ──→ (N) cart_items
--
-- categories (1) ──→ (N) products
--
-- products (1) ──→ (N) order_items
-- products (1) ──→ (N) product_specifications
-- products (1) ──→ (N) pc_build_items
-- products (1) ──→ (N) favorites
-- products (1) ──→ (N) cart_items
--
-- orders (1) ──→ (N) order_items
--
-- pc_builds (1) ──→ (N) pc_build_items
--
-- contact_messages (1) ──→ (N) message_replies
