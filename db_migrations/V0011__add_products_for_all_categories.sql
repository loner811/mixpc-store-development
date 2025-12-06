-- Добавляем товары для всех категорий (по 5 на категорию)

-- Процессоры (уже есть 2, добавляем 3)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(2, 'Intel Core i9-14900K', 'Флагманский процессор Intel 14-го поколения, 24 ядра, 32 потока', 59990, 'Intel', 'https://cdn.poehali.dev/files/processor-intel.jpg', true, true, 15),
(2, 'AMD Ryzen 7 7800X3D', 'Игровой процессор с 3D V-Cache технологией, 8 ядер', 45990, 'AMD', 'https://cdn.poehali.dev/files/processor-amd.jpg', true, true, 20),
(2, 'Intel Core i5-13600K', 'Производительный процессор среднего класса, 14 ядер', 32990, 'Intel', 'https://cdn.poehali.dev/files/processor-intel2.jpg', false, true, 25);

-- Видеокарты (уже есть 1, добавляем 4)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(3, 'NVIDIA GeForce RTX 4080', 'Мощная видеокарта для 4K gaming, 16GB GDDR6X', 129990, 'NVIDIA', 'https://cdn.poehali.dev/files/gpu-rtx4080.jpg', true, true, 10),
(3, 'AMD Radeon RX 7900 XTX', 'Топовая видеокарта AMD, 24GB GDDR6', 109990, 'AMD', 'https://cdn.poehali.dev/files/gpu-amd7900.jpg', true, true, 12),
(3, 'NVIDIA GeForce RTX 4070 Ti', 'Оптимальная видеокарта для 2K gaming, 12GB', 89990, 'NVIDIA', 'https://cdn.poehali.dev/files/gpu-rtx4070ti.jpg', false, true, 18),
(3, 'AMD Radeon RX 7800 XT', 'Производительная видеокарта среднего класса, 16GB', 69990, 'AMD', 'https://cdn.poehali.dev/files/gpu-amd7800.jpg', false, true, 20);

-- Материнские платы (уже есть 1, добавляем 4)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(4, 'MSI MPG Z790 CARBON', 'Топовая материнская плата Intel Z790, DDR5, PCIe 5.0', 42990, 'MSI', 'https://cdn.poehali.dev/files/mb-msi-z790.jpg', true, true, 15),
(4, 'ASUS TUF Gaming X670E-PLUS', 'Надежная плата для AMD Ryzen 7000, DDR5', 28990, 'ASUS', 'https://cdn.poehali.dev/files/mb-asus-x670.jpg', false, true, 20),
(4, 'Gigabyte B650 AORUS ELITE', 'Оптимальная плата для Ryzen 7000, DDR5', 21990, 'Gigabyte', 'https://cdn.poehali.dev/files/mb-gb-b650.jpg', false, true, 25),
(4, 'ASRock B760M Pro RS', 'Бюджетная mATX плата Intel B760, DDR4', 12990, 'ASRock', 'https://cdn.poehali.dev/files/mb-asrock-b760.jpg', false, true, 30);

-- Оперативная память (уже есть 1, добавляем 4)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(5, 'G.SKILL Trident Z5 32GB DDR5-6000', 'Высокоскоростная память DDR5 для gaming', 16990, 'G.SKILL', 'https://cdn.poehali.dev/files/ram-gskill.jpg', true, true, 40),
(5, 'Corsair Vengeance 32GB DDR5-5600', 'Надежная память DDR5 с RGB подсветкой', 13990, 'Corsair', 'https://cdn.poehali.dev/files/ram-corsair.jpg', false, true, 50),
(5, 'Kingston Fury Beast 16GB DDR4-3200', 'Проверенная память DDR4 для любых задач', 5990, 'Kingston', 'https://cdn.poehali.dev/files/ram-kingston-ddr4.jpg', false, true, 60),
(5, 'Crucial Ballistix 16GB DDR4-3600', 'Разгонная память DDR4 с низкими таймингами', 6990, 'Crucial', 'https://cdn.poehali.dev/files/ram-crucial.jpg', false, true, 45);

-- Накопители SSD (уже есть 1, добавляем 4)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(6, 'Samsung 990 PRO 1TB', 'Сверхбыстрый PCIe 4.0 SSD, до 7450 МБ/с', 12990, 'Samsung', 'https://cdn.poehali.dev/files/ssd-990pro.jpg', true, true, 35),
(6, 'WD Black SN850X 2TB', 'Gaming SSD с высокой производительностью', 19990, 'Western Digital', 'https://cdn.poehali.dev/files/ssd-wd-sn850x.jpg', true, true, 25),
(6, 'Kingston KC3000 1TB', 'Быстрый PCIe 4.0 SSD для профессионалов', 9990, 'Kingston', 'https://cdn.poehali.dev/files/ssd-kc3000.jpg', false, true, 40),
(6, 'Crucial P5 Plus 500GB', 'Компактный и быстрый SSD для системного диска', 5990, 'Crucial', 'https://cdn.poehali.dev/files/ssd-crucial-p5.jpg', false, true, 50);

-- Блоки питания (уже есть 1, добавляем 4)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(7, 'be quiet! Dark Power Pro 12 1200W', 'Премиум БП с платиновым сертификатом', 28990, 'be quiet!', 'https://cdn.poehali.dev/files/psu-bequiet-1200w.jpg', true, true, 10),
(7, 'Seasonic Focus GX-1000', 'Надежный золотой БП 1000W, модульный', 18990, 'Seasonic', 'https://cdn.poehali.dev/files/psu-seasonic-1000w.jpg', false, true, 15),
(7, 'Cooler Master V850 SFX Gold', 'Компактный SFX БП 850W для Mini-ITX', 15990, 'Cooler Master', 'https://cdn.poehali.dev/files/psu-cm-sfx850.jpg', false, true, 20),
(7, 'Thermaltake Toughpower GF1 750W', 'Золотой БП 750W с тихим кулером', 11990, 'Thermaltake', 'https://cdn.poehali.dev/files/psu-thermaltake-750w.jpg', false, true, 25);

-- Корпуса (уже есть 1, добавляем 4)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(8, 'Fractal Design Torrent', 'Премиум корпус с отличным охлаждением', 23990, 'Fractal Design', 'https://cdn.poehali.dev/files/case-fractal-torrent.jpg', true, true, 12),
(8, 'Lian Li O11 Dynamic EVO', 'Популярный корпус для водяного охлаждения', 21990, 'Lian Li', 'https://cdn.poehali.dev/files/case-lianli-o11.jpg', true, true, 15),
(8, 'NZXT H510 Flow', 'Стильный и функциональный Mid-Tower', 12990, 'NZXT', 'https://cdn.poehali.dev/files/case-nzxt-h510.jpg', false, true, 25),
(8, 'be quiet! Pure Base 500DX', 'Тихий корпус с RGB вентиляторами', 14990, 'be quiet!', 'https://cdn.poehali.dev/files/case-bequiet-500dx.jpg', false, true, 20);

-- Кулеры (уже есть 1, добавляем 4)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(9, 'Noctua NH-D15', 'Легендарный башенный кулер с 2 вентиляторами', 10990, 'Noctua', 'https://cdn.poehali.dev/files/cooler-noctua-d15.jpg', true, true, 30),
(9, 'Arctic Liquid Freezer II 360', 'Мощная СВО 360мм с тихой работой', 13990, 'Arctic', 'https://cdn.poehali.dev/files/cooler-arctic-360.jpg', true, true, 20),
(9, 'Cooler Master Hyper 212', 'Популярный бюджетный башенный кулер', 3990, 'Cooler Master', 'https://cdn.poehali.dev/files/cooler-cm-212.jpg', false, true, 50),
(9, 'DeepCool AK620', 'Эффективный двухбашенный кулер', 5990, 'DeepCool', 'https://cdn.poehali.dev/files/cooler-deepcool-ak620.jpg', false, true, 40);

-- Мониторы (добавляем 5)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(10, 'ASUS ROG Swift PG27UQ', '27" 4K 144Hz G-SYNC Ultimate монитор', 89990, 'ASUS', 'https://cdn.poehali.dev/files/monitor-asus-pg27uq.jpg', true, true, 8),
(10, 'LG UltraGear 27GP950', '27" 4K 160Hz Nano IPS gaming монитор', 69990, 'LG', 'https://cdn.poehali.dev/files/monitor-lg-27gp950.jpg', true, true, 12),
(10, 'Samsung Odyssey G7 32"', '32" 2K 240Hz curved gaming монитор', 54990, 'Samsung', 'https://cdn.poehali.dev/files/monitor-samsung-g7.jpg', false, true, 15),
(10, 'Dell S2721DGF', '27" 2K 165Hz IPS монитор для gaming', 39990, 'Dell', 'https://cdn.poehali.dev/files/monitor-dell-s2721.jpg', false, true, 20),
(10, 'AOC 24G2 24"', '24" Full HD 144Hz IPS бюджетный gaming', 19990, 'AOC', 'https://cdn.poehali.dev/files/monitor-aoc-24g2.jpg', false, true, 30);

-- Клавиатуры (добавляем 5)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(11, 'Logitech G Pro X', 'Механическая TKL клавиатура для киберспорта', 14990, 'Logitech', 'https://cdn.poehali.dev/files/keyboard-logitech-prox.jpg', true, true, 25),
(11, 'Razer BlackWidow V3', 'Полноразмерная механическая клавиатура RGB', 12990, 'Razer', 'https://cdn.poehali.dev/files/keyboard-razer-bw.jpg', true, true, 20),
(11, 'SteelSeries Apex Pro', 'Регулируемые механические переключатели', 19990, 'SteelSeries', 'https://cdn.poehali.dev/files/keyboard-ss-apex.jpg', false, true, 15),
(11, 'HyperX Alloy FPS Pro', 'Компактная TKL клавиатура для FPS игр', 8990, 'HyperX', 'https://cdn.poehali.dev/files/keyboard-hyperx-fps.jpg', false, true, 30),
(11, 'Keychron K8', 'Беспроводная механическая клавиатура TKL', 9990, 'Keychron', 'https://cdn.poehali.dev/files/keyboard-keychron-k8.jpg', false, true, 35);

-- Мыши (уже есть 2, добавляем 3)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(12, 'Logitech G Pro X Superlight', 'Беспроводная gaming мышь 63г с HERO сенсором', 14990, 'Logitech', 'https://cdn.poehali.dev/files/mouse-logitech-superlight.jpg', true, true, 40),
(12, 'Razer DeathAdder V3 Pro', 'Эргономичная беспроводная мышь для профи', 13990, 'Razer', 'https://cdn.poehali.dev/files/mouse-razer-dav3.jpg', true, true, 35),
(12, 'SteelSeries Rival 3', 'Легкая проводная мышь для любых игр', 3990, 'SteelSeries', 'https://cdn.poehali.dev/files/mouse-ss-rival3.jpg', false, true, 60);

-- Компьютеры (добавляем 5 готовых сборок)
INSERT INTO t_p58610579_mixpc_store_developm.products (category_id, name, description, price, brand, image_filename, is_featured, in_stock, stock_quantity)
VALUES 
(1, 'Gaming PC Ultimate RTX 4090', 'i9-14900K, RTX 4090, 64GB DDR5, 2TB SSD', 399990, 'Custom Build', 'https://cdn.poehali.dev/files/pc-ultimate.jpg', true, true, 3),
(1, 'Gaming PC Pro RTX 4080', 'Ryzen 9 7950X, RTX 4080, 32GB DDR5, 1TB SSD', 289990, 'Custom Build', 'https://cdn.poehali.dev/files/pc-pro.jpg', true, true, 5),
(1, 'Gaming PC Advanced RTX 4070 Ti', 'i7-13700K, RTX 4070 Ti, 32GB DDR5, 1TB SSD', 209990, 'Custom Build', 'https://cdn.poehali.dev/files/pc-advanced.jpg', false, true, 8),
(1, 'Gaming PC Standard RX 7800 XT', 'Ryzen 7 7800X3D, RX 7800 XT, 16GB DDR5, 1TB SSD', 159990, 'Custom Build', 'https://cdn.poehali.dev/files/pc-standard.jpg', false, true, 10),
(1, 'Office PC Compact', 'i5-13400F, 16GB DDR4, 500GB SSD, встроенная графика', 69990, 'Custom Build', 'https://cdn.poehali.dev/files/pc-office.jpg', false, true, 15);