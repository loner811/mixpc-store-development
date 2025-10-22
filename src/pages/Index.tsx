import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

const categories = [
  { id: 1, name: 'Компьютеры', icon: 'Monitor' },
  { id: 2, name: 'Процессоры', icon: 'Cpu' },
  { id: 3, name: 'Видеокарты', icon: 'Zap' },
  { id: 4, name: 'Материнские платы', icon: 'CircuitBoard' },
  { id: 5, name: 'Оперативная память', icon: 'MemoryStick' },
  { id: 6, name: 'Накопители SSD', icon: 'HardDrive' },
  { id: 7, name: 'Блоки питания', icon: 'Battery' },
  { id: 8, name: 'Корпуса', icon: 'Box' },
  { id: 9, name: 'Куллеры', icon: 'Fan' },
  { id: 10, name: 'Мониторы', icon: 'MonitorDot' },
  { id: 11, name: 'Клавиатуры', icon: 'Keyboard' },
  { id: 12, name: 'Компьютерные мыши', icon: 'Mouse' }
];

const allProducts = [
  // Компьютеры
  { id: 1, name: 'Игровой ПК AMD Ryzen 7', price: 89990, brand: 'Custom Build', category: 'Компьютеры', image: '/images/products/1.jpg' },
  { id: 2, name: 'Офисный ПК Intel Core i5', price: 45990, brand: 'Custom Build', category: 'Компьютеры', image: '/images/products/2.jpg' },
  { id: 3, name: 'Рабочая станция Intel Xeon', price: 159990, brand: 'HP', category: 'Компьютеры', image: '/images/products/3.jpg' },
  { id: 4, name: 'Игровой ПК Intel Core i9', price: 189990, brand: 'MSI', category: 'Компьютеры', image: '/images/products/4.jpg' },
  { id: 5, name: 'Мини-ПК AMD Ryzen 5', price: 39990, brand: 'ASUS', category: 'Компьютеры', image: '/images/products/5.jpg' },
  { id: 6, name: 'Игровой ПК AMD Ryzen 9', price: 219990, brand: 'Custom Build', category: 'Компьютеры', image: '/images/products/6.jpg' },
  { id: 7, name: 'Офисный ПК Intel Core i3', price: 29990, brand: 'Dell', category: 'Компьютеры', image: '/images/products/7.jpg' },
  { id: 8, name: 'Стример ПК AMD Ryzen 7', price: 129990, brand: 'Custom Build', category: 'Компьютеры', image: '/images/products/8.jpg' },
  { id: 9, name: 'Рабочий ПК Intel Core i7', price: 79990, brand: 'Lenovo', category: 'Компьютеры', image: '/images/products/9.jpg' },
  { id: 10, name: 'Игровой ПК RTX 4090', price: 349990, brand: 'Custom Build', category: 'Компьютеры', image: '/images/products/10.jpg' },

  // Процессоры
  { id: 11, name: 'AMD Ryzen 9 7950X', price: 45990, brand: 'AMD', category: 'Процессоры', image: '/images/products/11.jpg' },
  { id: 12, name: 'Intel Core i9-13900K', price: 52990, brand: 'Intel', category: 'Процессоры', image: '/images/products/12.jpg' },
  { id: 13, name: 'AMD Ryzen 7 7700X', price: 29990, brand: 'AMD', category: 'Процессоры', image: '/images/products/13.jpg' },
  { id: 14, name: 'Intel Core i7-13700K', price: 38990, brand: 'Intel', category: 'Процессоры', image: '/images/products/14.jpg' },
  { id: 15, name: 'AMD Ryzen 5 7600X', price: 22990, brand: 'AMD', category: 'Процессоры', image: '/images/products/15.jpg' },
  { id: 16, name: 'Intel Core i5-13600K', price: 28990, brand: 'Intel', category: 'Процессоры', image: '/images/products/16.jpg' },
  { id: 17, name: 'AMD Ryzen 9 7900X', price: 39990, brand: 'AMD', category: 'Процессоры', image: '/images/products/17.jpg' },
  { id: 18, name: 'Intel Core i9-12900K', price: 44990, brand: 'Intel', category: 'Процессоры', image: '/images/products/18.jpg' },
  { id: 19, name: 'AMD Ryzen 7 5800X3D', price: 31990, brand: 'AMD', category: 'Процессоры', image: '/images/products/19.jpg' },
  { id: 20, name: 'Intel Core i5-12400F', price: 15990, brand: 'Intel', category: 'Процессоры', image: '/images/products/20.jpg' },

  // Видеокарты
  { id: 21, name: 'NVIDIA GeForce RTX 4090', price: 159990, brand: 'NVIDIA', category: 'Видеокарты', image: '/images/products/21.jpg' },
  { id: 22, name: 'AMD Radeon RX 7900 XTX', price: 89990, brand: 'AMD', category: 'Видеокарты', image: '/images/products/22.jpg' },
  { id: 23, name: 'NVIDIA GeForce RTX 4080', price: 119990, brand: 'NVIDIA', category: 'Видеокарты', image: '/images/products/23.jpg' },
  { id: 24, name: 'AMD Radeon RX 7900 XT', price: 74990, brand: 'AMD', category: 'Видеокарты', image: '/images/products/24.jpg' },
  { id: 25, name: 'NVIDIA GeForce RTX 4070 Ti', price: 79990, brand: 'NVIDIA', category: 'Видеокарты', image: '/images/products/25.jpg' },
  { id: 26, name: 'AMD Radeon RX 7800 XT', price: 59990, brand: 'AMD', category: 'Видеокарты', image: '/images/products/26.jpg' },
  { id: 27, name: 'NVIDIA GeForce RTX 4070', price: 64990, brand: 'NVIDIA', category: 'Видеокарты', image: '/images/products/27.jpg' },
  { id: 28, name: 'AMD Radeon RX 7700 XT', price: 49990, brand: 'AMD', category: 'Видеокарты', image: '/images/products/28.jpg' },
  { id: 29, name: 'NVIDIA GeForce RTX 4060 Ti', price: 44990, brand: 'NVIDIA', category: 'Видеокарты', image: '/images/products/29.jpg' },
  { id: 30, name: 'AMD Radeon RX 7600', price: 29990, brand: 'AMD', category: 'Видеокарты', image: '/images/products/30.jpg' },

  // Материнские платы
  { id: 31, name: 'ASUS ROG Strix B650-E', price: 24990, brand: 'ASUS', category: 'Материнские платы', image: '/images/products/31.jpg' },
  { id: 32, name: 'MSI MAG B760 Tomahawk', price: 18990, brand: 'MSI', category: 'Материнские платы', image: '/images/products/32.jpg' },
  { id: 33, name: 'Gigabyte X670 AORUS Elite', price: 29990, brand: 'Gigabyte', category: 'Материнские платы', image: '/images/products/33.jpg' },
  { id: 34, name: 'ASRock Z790 Steel Legend', price: 21990, brand: 'ASRock', category: 'Материнские платы', image: '/images/products/34.jpg' },
  { id: 35, name: 'ASUS TUF Gaming B650', price: 16990, brand: 'ASUS', category: 'Материнские платы', image: '/images/products/35.jpg' },
  { id: 36, name: 'MSI MPG Z790 Carbon', price: 34990, brand: 'MSI', category: 'Материнские платы', image: '/images/products/36.jpg' },
  { id: 37, name: 'Gigabyte B660M DS3H', price: 12990, brand: 'Gigabyte', category: 'Материнские платы', image: '/images/products/37.jpg' },
  { id: 38, name: 'ASUS Prime X670-P', price: 27990, brand: 'ASUS', category: 'Материнские платы', image: '/images/products/38.jpg' },
  { id: 39, name: 'MSI PRO B650-P', price: 14990, brand: 'MSI', category: 'Материнские платы', image: '/images/products/39.jpg' },
  { id: 40, name: 'ASRock B760M Pro RS', price: 11990, brand: 'ASRock', category: 'Материнские платы', image: '/images/products/40.jpg' },

  // Оперативная память
  { id: 41, name: 'Kingston Fury 32GB DDR5', price: 12990, brand: 'Kingston', category: 'Оперативная память', image: '/images/products/41.jpg' },
  { id: 42, name: 'Corsair Vengeance 32GB DDR5', price: 14990, brand: 'Corsair', category: 'Оперативная память', image: '/images/products/42.jpg' },
  { id: 43, name: 'G.Skill Trident Z5 32GB DDR5', price: 16990, brand: 'G.Skill', category: 'Оперативная память', image: '/images/products/43.jpg' },
  { id: 44, name: 'Kingston Fury 16GB DDR4', price: 5990, brand: 'Kingston', category: 'Оперативная память', image: '/images/products/44.jpg' },
  { id: 45, name: 'Corsair Vengeance RGB 32GB DDR4', price: 9990, brand: 'Corsair', category: 'Оперативная память', image: '/images/products/45.jpg' },
  { id: 46, name: 'G.Skill Ripjaws V 16GB DDR4', price: 4990, brand: 'G.Skill', category: 'Оперативная память', image: '/images/products/46.jpg' },
  { id: 47, name: 'Crucial 32GB DDR5', price: 11990, brand: 'Crucial', category: 'Оперативная память', image: '/images/products/47.jpg' },
  { id: 48, name: 'TeamGroup T-Force 32GB DDR4', price: 8990, brand: 'TeamGroup', category: 'Оперативная память', image: '/images/products/48.jpg' },
  { id: 49, name: 'Kingston Fury Beast 64GB DDR5', price: 24990, brand: 'Kingston', category: 'Оперативная память', image: '/images/products/49.jpg' },
  { id: 50, name: 'Corsair Dominator 64GB DDR5', price: 29990, brand: 'Corsair', category: 'Оперативная память', image: '/images/products/50.jpg' },

  // Накопители SSD
  { id: 51, name: 'Samsung 980 PRO 2TB', price: 18990, brand: 'Samsung', category: 'Накопители SSD', image: '/images/products/51.jpg' },
  { id: 52, name: 'WD Black SN850X 2TB', price: 17990, brand: 'Western Digital', category: 'Накопители SSD', image: '/images/products/52.jpg' },
  { id: 53, name: 'Kingston KC3000 1TB', price: 9990, brand: 'Kingston', category: 'Накопители SSD', image: '/images/products/53.jpg' },
  { id: 54, name: 'Crucial P5 Plus 1TB', price: 8990, brand: 'Crucial', category: 'Накопители SSD', image: '/images/products/54.jpg' },
  { id: 55, name: 'Samsung 990 PRO 1TB', price: 11990, brand: 'Samsung', category: 'Накопители SSD', image: '/images/products/55.jpg' },
  { id: 56, name: 'Seagate FireCuda 530 2TB', price: 19990, brand: 'Seagate', category: 'Накопители SSD', image: '/images/products/56.jpg' },
  { id: 57, name: 'ADATA XPG Gammix S70 1TB', price: 10990, brand: 'ADATA', category: 'Накопители SSD', image: '/images/products/57.jpg' },
  { id: 58, name: 'WD Blue SN570 500GB', price: 5990, brand: 'Western Digital', category: 'Накопители SSD', image: '/images/products/58.jpg' },
  { id: 59, name: 'Kingston NV2 1TB', price: 7990, brand: 'Kingston', category: 'Накопители SSD', image: '/images/products/59.jpg' },
  { id: 60, name: 'Samsung 870 EVO 1TB', price: 9990, brand: 'Samsung', category: 'Накопители SSD', image: '/images/products/60.jpg' },

  // Блоки питания
  { id: 61, name: 'Corsair RM850x', price: 14990, brand: 'Corsair', category: 'Блоки питания', image: '/images/products/61.jpg' },
  { id: 62, name: 'Seasonic Focus GX-750', price: 12990, brand: 'Seasonic', category: 'Блоки питания', image: '/images/products/62.jpg' },
  { id: 63, name: 'be quiet! Straight Power 11 750W', price: 13990, brand: 'be quiet!', category: 'Блоки питания', image: '/images/products/63.jpg' },
  { id: 64, name: 'Thermaltake Toughpower GF1 850W', price: 11990, brand: 'Thermaltake', category: 'Блоки питания', image: '/images/products/64.jpg' },
  { id: 65, name: 'ASUS ROG Thor 1200W', price: 29990, brand: 'ASUS', category: 'Блоки питания', image: '/images/products/65.jpg' },
  { id: 66, name: 'Cooler Master V850 SFX Gold', price: 15990, brand: 'Cooler Master', category: 'Блоки питания', image: '/images/products/66.jpg' },
  { id: 67, name: 'EVGA SuperNOVA 750 G6', price: 12990, brand: 'EVGA', category: 'Блоки питания', image: '/images/products/67.jpg' },
  { id: 68, name: 'MSI MPG A850GF', price: 13990, brand: 'MSI', category: 'Блоки питания', image: '/images/products/68.jpg' },
  { id: 69, name: 'DeepCool PX1000G', price: 11990, brand: 'DeepCool', category: 'Блоки питания', image: '/images/products/69.jpg' },
  { id: 70, name: 'Corsair HX1000i', price: 24990, brand: 'Corsair', category: 'Блоки питания', image: '/images/products/70.jpg' },

  // Корпуса
  { id: 71, name: 'NZXT H510 Elite', price: 14990, brand: 'NZXT', category: 'Корпуса', image: '/images/products/71.jpg' },
  { id: 72, name: 'Corsair 4000D Airflow', price: 9990, brand: 'Corsair', category: 'Корпуса', image: '/images/products/72.jpg' },
  { id: 73, name: 'Fractal Design Meshify 2', price: 12990, brand: 'Fractal Design', category: 'Корпуса', image: '/images/products/73.jpg' },
  { id: 74, name: 'Lian Li O11 Dynamic EVO', price: 17990, brand: 'Lian Li', category: 'Корпуса', image: '/images/products/74.jpg' },
  { id: 75, name: 'be quiet! Pure Base 500DX', price: 11990, brand: 'be quiet!', category: 'Корпуса', image: '/images/products/75.jpg' },
  { id: 76, name: 'Cooler Master MasterBox TD500', price: 8990, brand: 'Cooler Master', category: 'Корпуса', image: '/images/products/76.jpg' },
  { id: 77, name: 'Thermaltake View 51', price: 19990, brand: 'Thermaltake', category: 'Корпуса', image: '/images/products/77.jpg' },
  { id: 78, name: 'Phanteks Eclipse P400A', price: 10990, brand: 'Phanteks', category: 'Корпуса', image: '/images/products/78.jpg' },
  { id: 79, name: 'DeepCool CC560', price: 6990, brand: 'DeepCool', category: 'Корпуса', image: '/images/products/79.jpg' },
  { id: 80, name: 'ASUS TUF Gaming GT501', price: 15990, brand: 'ASUS', category: 'Корпуса', image: '/images/products/80.jpg' },

  // Куллеры
  { id: 81, name: 'Noctua NH-D15', price: 9990, brand: 'Noctua', category: 'Куллеры', image: '/images/products/81.jpg' },
  { id: 82, name: 'be quiet! Dark Rock Pro 4', price: 8990, brand: 'be quiet!', category: 'Куллеры', image: '/images/products/82.jpg' },
  { id: 83, name: 'Cooler Master Hyper 212', price: 3990, brand: 'Cooler Master', category: 'Куллеры', image: '/images/products/83.jpg' },
  { id: 84, name: 'Arctic Liquid Freezer II 280', price: 11990, brand: 'Arctic', category: 'Куллеры', image: '/images/products/84.jpg' },
  { id: 85, name: 'Corsair iCUE H150i Elite', price: 17990, brand: 'Corsair', category: 'Куллеры', image: '/images/products/85.jpg' },
  { id: 86, name: 'DeepCool AK620', price: 5990, brand: 'DeepCool', category: 'Куллеры', image: '/images/products/86.jpg' },
  { id: 87, name: 'NZXT Kraken X63', price: 14990, brand: 'NZXT', category: 'Куллеры', image: '/images/products/87.jpg' },
  { id: 88, name: 'Thermaltake TOUGHAIR 510', price: 6990, brand: 'Thermaltake', category: 'Куллеры', image: '/images/products/88.jpg' },
  { id: 89, name: 'Noctua NH-U12S', price: 7990, brand: 'Noctua', category: 'Куллеры', image: '/images/products/89.jpg' },
  { id: 90, name: 'be quiet! Pure Loop 2', price: 12990, brand: 'be quiet!', category: 'Куллеры', image: '/images/products/90.jpg' },

  // Мониторы
  { id: 91, name: 'Samsung Odyssey G7 32"', price: 49990, brand: 'Samsung', category: 'Мониторы', image: '/images/products/91.jpg' },
  { id: 92, name: 'LG UltraGear 27" 144Hz', price: 29990, brand: 'LG', category: 'Мониторы', image: '/images/products/92.jpg' },
  { id: 93, name: 'ASUS TUF Gaming VG27AQ', price: 34990, brand: 'ASUS', category: 'Мониторы', image: '/images/products/93.jpg' },
  { id: 94, name: 'Dell S2721DGF 27"', price: 39990, brand: 'Dell', category: 'Мониторы', image: '/images/products/94.jpg' },
  { id: 95, name: 'AOC 24G2 24" 144Hz', price: 19990, brand: 'AOC', category: 'Мониторы', image: '/images/products/95.jpg' },
  { id: 96, name: 'MSI Optix MAG274QRF', price: 44990, brand: 'MSI', category: 'Мониторы', image: '/images/products/96.jpg' },
  { id: 97, name: 'BenQ ZOWIE XL2546K', price: 54990, brand: 'BenQ', category: 'Мониторы', image: '/images/products/97.jpg' },
  { id: 98, name: 'Gigabyte M27Q 27"', price: 32990, brand: 'Gigabyte', category: 'Мониторы', image: '/images/products/98.jpg' },
  { id: 99, name: 'ViewSonic Elite XG270', price: 37990, brand: 'ViewSonic', category: 'Мониторы', image: '/images/products/99.jpg' },
  { id: 100, name: 'Acer Predator XB273U', price: 47990, brand: 'Acer', category: 'Мониторы', image: '/images/products/100.jpg' },

  // Клавиатуры
  { id: 101, name: 'Logitech G Pro X', price: 12990, brand: 'Logitech', category: 'Клавиатуры', image: '/images/products/101.jpg' },
  { id: 102, name: 'Razer BlackWidow V3', price: 11990, brand: 'Razer', category: 'Клавиатуры', image: '/images/products/102.jpg' },
  { id: 103, name: 'SteelSeries Apex Pro', price: 19990, brand: 'SteelSeries', category: 'Клавиатуры', image: '/images/products/103.jpg' },
  { id: 104, name: 'Corsair K70 RGB', price: 13990, brand: 'Corsair', category: 'Клавиатуры', image: '/images/products/104.jpg' },
  { id: 105, name: 'HyperX Alloy Origins', price: 9990, brand: 'HyperX', category: 'Клавиатуры', image: '/images/products/105.jpg' },
  { id: 106, name: 'Keychron K8 Pro', price: 10990, brand: 'Keychron', category: 'Клавиатуры', image: '/images/products/106.jpg' },
  { id: 107, name: 'ASUS ROG Strix Scope', price: 14990, brand: 'ASUS', category: 'Клавиатуры', image: '/images/products/107.jpg' },
  { id: 108, name: 'Ducky One 2 Mini', price: 11990, brand: 'Ducky', category: 'Клавиатуры', image: '/images/products/108.jpg' },
  { id: 109, name: 'Cooler Master CK530', price: 7990, brand: 'Cooler Master', category: 'Клавиатуры', image: '/images/products/109.jpg' },
  { id: 110, name: 'MSI Vigor GK50 Elite', price: 8990, brand: 'MSI', category: 'Клавиатуры', image: '/images/products/110.jpg' },

  // Компьютерные мыши
  { id: 111, name: 'Logitech G Pro X Superlight', price: 12990, brand: 'Logitech', category: 'Компьютерные мыши', image: '/images/products/111.jpg' },
  { id: 112, name: 'Razer DeathAdder V3', price: 8990, brand: 'Razer', category: 'Компьютерные мыши', image: '/images/products/112.jpg' },
  { id: 113, name: 'SteelSeries Rival 5', price: 6990, brand: 'SteelSeries', category: 'Компьютерные мыши', image: '/images/products/113.jpg' },
  { id: 114, name: 'Corsair Dark Core RGB', price: 9990, brand: 'Corsair', category: 'Компьютерные мыши', image: '/images/products/114.jpg' },
  { id: 115, name: 'HyperX Pulsefire Haste', price: 4990, brand: 'HyperX', category: 'Компьютерные мыши', image: '/images/products/115.jpg' },
  { id: 116, name: 'Logitech G502 Hero', price: 7990, brand: 'Logitech', category: 'Компьютерные мыши', image: '/images/products/116.jpg' },
  { id: 117, name: 'Razer Viper Ultimate', price: 11990, brand: 'Razer', category: 'Компьютерные мыши', image: '/images/products/117.jpg' },
  { id: 118, name: 'ASUS ROG Gladius III', price: 8990, brand: 'ASUS', category: 'Компьютерные мыши', image: '/images/products/118.jpg' },
  { id: 119, name: 'Cooler Master MM731', price: 5990, brand: 'Cooler Master', category: 'Компьютерные мыши', image: '/images/products/119.jpg' },
  { id: 120, name: 'MSI Clutch GM41', price: 6990, brand: 'MSI', category: 'Компьютерные мыши', image: '/images/products/120.jpg' },
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Checkout
  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryType: 'delivery',
    address: ''
  });
  
  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProducts, setAdminProducts] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [adminActiveTab, setAdminActiveTab] = useState('products');
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  
  // Featured products
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  
  // Filters
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');

  // Auto-slider
  const [sliderOffset, setSliderOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderOffset((prev) => prev - 1);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);
  
  useEffect(() => {
    loadFeaturedProducts();
  }, []);
  
  const loadFeaturedProducts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/cceb4ca9-48f7-4a28-a301-3dd14baa0d71?featured=true');
      const products = await response.json();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    }
  };

  const loadAdminData = async () => {
    try {
      const productsRes = await fetch('https://functions.poehali.dev/858f5e57-c172-4ef7-9a49-0a25a2e84cc5', {
        headers: { 'X-Admin-Auth': 'admin:123' }
      });
      const products = await productsRes.json();
      setAdminProducts(products);

      const ordersRes = await fetch('https://functions.poehali.dev/55d2462d-02a8-4732-91f6-95271b22efe9', {
        headers: { 'X-Admin-Auth': 'admin:123' }
      });
      const orders = await ordersRes.json();
      setAdminOrders(orders);

      const localMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      setAdminMessages(localMessages);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleSaveProduct = async (product: any) => {
    const url = 'https://functions.poehali.dev/858f5e57-c172-4ef7-9a49-0a25a2e84cc5';
    const method = product.id ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Auth': 'admin:123'
      },
      body: JSON.stringify(product)
    });
    
    loadAdminData();
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    
    await fetch(`https://functions.poehali.dev/858f5e57-c172-4ef7-9a49-0a25a2e84cc5?id=${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Auth': 'admin:123' }
    });
    
    loadAdminData();
  };

  const getFilteredProducts = () => {
    let products = selectedCategory 
      ? allProducts.filter(p => p.category === selectedCategory)
      : allProducts;

    if (searchQuery) {
      products = products.filter(p => 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      products = products.filter(p => 
        p.price >= priceRange[0] && p.price <= priceRange[1]
      );

      if (selectedBrands.length > 0) {
        products = products.filter(p => selectedBrands.includes(p.brand));
      }

      if (sortBy === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'name') {
        products.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return products;
  };

  const filteredProducts = getFilteredProducts();

  const getBrandsForCategory = () => {
    if (!selectedCategory) return [];
    const products = allProducts.filter(p => p.category === selectedCategory);
    const brands = [...new Set(products.map(p => p.brand))];
    return brands.sort();
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const addToCart = (product: any) => {
    if (!isLoggedIn) {
      alert('Войдите в систему для добавления товаров в корзину');
      return;
    }
    setCart([...cart, product]);
  };

  const addToFavorites = (product: any) => {
    if (!isLoggedIn) {
      alert('Войдите в систему для добавления товаров в избранное');
      return;
    }
    if (!favorites.find(f => f.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(p => p.id !== productId));
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(favorites.filter(p => p.id !== productId));
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div 
              className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => {
                setCurrentPage('home');
                setSelectedCategory(null);
                setSearchQuery('');
              }}
            >
              MIX PC
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-center hidden md:block">
              <div className="font-semibold text-base text-primary">8 (800) 555-77-30</div>
              <div className="flex gap-2 mt-1 justify-center">
                <a href="https://t.me" target="_blank" rel="noopener" className="text-primary hover:opacity-80 transition-opacity">
                  <Icon name="Send" size={20} />
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener" className="text-primary hover:opacity-80 transition-opacity">
                  <Icon name="MessageCircle" size={20} />
                </a>
              </div>
            </div>

            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 gradient-teal text-white hover:opacity-90">
                  <Icon name="User" size={18} />
                  <span className="hidden sm:inline">Войти</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Личный кабинет</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Вход</TabsTrigger>
                    <TabsTrigger value="register">Регистрация</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="space-y-4 mt-4">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      const username = formData.get('login') as string;
                      const password = formData.get('password') as string;
                      
                      if (username === 'admin' && password === '123') {
                        setCurrentUser({ id: 1, username: 'admin', role: 'admin', email: 'admin@mixpc.ru' });
                        setIsLoggedIn(true);
                        setIsAdmin(true);
                        setLoginOpen(false);
                        alert('Добро пожаловать, администратор!');
                      } else if (username === 'login' && password === '123') {
                        setCurrentUser({ id: 2, username: 'login', role: 'user', email: 'user@example.com' });
                        setIsLoggedIn(true);
                        setIsAdmin(false);
                        setLoginOpen(false);
                        alert('Вход выполнен успешно!');
                      } else {
                        alert('Неверный логин или пароль');
                      }
                    }}>
                      <div className="space-y-2">
                        <Label>Логин</Label>
                        <Input name="login" placeholder="Введите логин" required />
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label>Пароль</Label>
                        <Input name="password" type="password" placeholder="Введите пароль" required />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 h-11 mt-4"
                      >
                        Войти
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Логин</Label>
                      <Input placeholder="Придумайте логин" />
                    </div>
                    <div className="space-y-2">
                      <Label>Пароль</Label>
                      <Input type="password" placeholder="Придумайте пароль" />
                    </div>
                    <Button className="w-full bg-secondary hover:bg-secondary/90 h-11">
                      Зарегистрироваться
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="relative gradient-teal text-white hover:opacity-90">
                  <Icon name="Heart" size={20} />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-white">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Избранное</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                  {favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Heart" size={64} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Избранное пусто</p>
                    </div>
                  ) : (
                    favorites.map(product => (
                      <Card key={product.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                              <Icon name="Package" size={32} className="text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{product.name}</h4>
                              <p className="text-lg font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => removeFromFavorites(product.id)}
                            >
                              <Icon name="X" size={20} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="relative gradient-teal text-white hover:opacity-90">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-white">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cart.map(product => (
                        <Card key={product.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                                <Icon name="Package" size={32} className="text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{product.name}</h4>
                                <p className="text-lg font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                              </div>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => removeFromCart(product.id)}
                              >
                                <Icon name="X" size={20} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="sticky bottom-0 bg-background pt-4 border-t">
                        <div className="flex justify-between mb-4">
                          <span className="text-lg font-semibold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">
                            {cart.reduce((sum, p) => sum + p.price, 0).toLocaleString()} ₽
                          </span>
                        </div>
                        <Button 
                          className="w-full h-12 text-lg gradient-teal"
                          onClick={() => setCurrentPage('checkout')}
                        >
                          Перейти к оформлению
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="relative max-w-2xl w-full">
            <Input
              placeholder="Поиск по брендам (AMD, Intel, NVIDIA...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 justify-center">
          <Button
            variant={currentPage === 'home' && !selectedCategory ? 'default' : 'outline'}
            onClick={() => {
              setCurrentPage('home');
              setSelectedCategory(null);
            }}
            className={currentPage === 'home' && !selectedCategory ? 'gradient-teal' : ''}
          >
            Главная
          </Button>
          <Button
            variant={currentPage === 'catalog' && !selectedCategory ? 'default' : 'outline'}
            onClick={() => {
              setCurrentPage('catalog');
              setSelectedCategory(null);
            }}
            className={currentPage === 'catalog' && !selectedCategory ? 'gradient-teal' : ''}
          >
            Каталог
          </Button>
          <Button
            variant={currentPage === 'about' ? 'default' : 'outline'}
            onClick={() => setCurrentPage('about')}
            className={currentPage === 'about' ? 'gradient-teal' : ''}
          >
            О нас
          </Button>
          <Button
            variant={currentPage === 'delivery' ? 'default' : 'outline'}
            onClick={() => setCurrentPage('delivery')}
            className={currentPage === 'delivery' ? 'gradient-teal' : ''}
          >
            Доставка
          </Button>
          <Button
            variant={currentPage === 'warranty' ? 'default' : 'outline'}
            onClick={() => setCurrentPage('warranty')}
            className={currentPage === 'warranty' ? 'gradient-teal' : ''}
          >
            Гарантия
          </Button>
          <Button
            variant={currentPage === 'contact' ? 'default' : 'outline'}
            onClick={() => setCurrentPage('contact')}
            className={currentPage === 'contact' ? 'gradient-teal' : ''}
          >
            Контакты
          </Button>
          {isAdmin && (
            <Button
              variant={currentPage === 'admin' ? 'default' : 'outline'}
              onClick={() => setCurrentPage('admin')}
              className={currentPage === 'admin' ? 'gradient-teal' : ''}
            >
              <Icon name="Settings" size={16} className="mr-2" />
              Админка
            </Button>
          )}
        </nav>
      </div>
    </header>
  );

  const renderCategoryPage = () => {
    const brands = getBrandsForCategory();
    const minPrice = Math.min(...allProducts.filter(p => p.category === selectedCategory).map(p => p.price));
    const maxPrice = Math.max(...allProducts.filter(p => p.category === selectedCategory).map(p => p.price));

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Цена</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={maxPrice}
                  step={1000}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0].toLocaleString()} ₽</span>
                  <span>{priceRange[1].toLocaleString()} ₽</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Бренд</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center gap-2">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <label htmlFor={brand} className="text-sm cursor-pointer flex-1">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPriceRange([0, maxPrice]);
                setSelectedBrands([]);
                setSortBy('default');
              }}
            >
              Сбросить фильтры
            </Button>
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{selectedCategory}</h1>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-input bg-background"
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="name">По названию</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const getProductImage = (productId: number) => {
                  const images = [
                    'https://cdn.poehali.dev/projects/f7df5c93-3ffb-476e-bc55-4da98f7f2c0a/files/bb10f9c9-ec03-4dae-852d-ab8eb7cb81c7.jpg',
                    'https://cdn.poehali.dev/projects/f7df5c93-3ffb-476e-bc55-4da98f7f2c0a/files/11810e39-9f5c-43b4-979a-e723f231c489.jpg',
                    'https://cdn.poehali.dev/projects/f7df5c93-3ffb-476e-bc55-4da98f7f2c0a/files/825e48c1-6cd6-4d1f-9d28-ff9464fff64f.jpg',
                  ];
                  return images[productId % images.length];
                };

                return (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-4">
                      <div className="aspect-square rounded-lg mb-4 relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                        <img 
                          src={getProductImage(product.id)} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => addToFavorites(product)}
                        >
                          <Icon name="Heart" size={18} />
                        </Button>
                      </div>
                      <Badge className="mb-2">{product.brand}</Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3em]">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary mb-4">{product.price.toLocaleString()} ₽</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full gradient-teal"
                        onClick={() => addToCart(product)}
                      >
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHomePage = () => {
    const popularProducts = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 20);
    const duplicatedProducts = [...popularProducts, ...popularProducts, ...popularProducts];

    return (
      <div className="min-h-screen">
        <section 
          className="relative text-white py-32 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(13, 71, 161, 0.85), rgba(21, 101, 192, 0.85)), url(https://cdn.poehali.dev/projects/f7df5c93-3ffb-476e-bc55-4da98f7f2c0a/files/aace088c-460f-4ba7-b0f1-3f2975047791.jpg)',
          }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-lg">
              MIX PC - Ваш надежный поставщик компьютерной техники
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-md">
              Широкий ассортимент комплектующих и готовых решений по выгодным ценам
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg shadow-2xl"
              onClick={() => setCurrentPage('catalog')}
            >
              Перейти в каталог
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Популярные товары</h2>
            <div className="relative overflow-hidden">
              <div 
                className="flex gap-6 transition-none"
                style={{
                  transform: `translateX(${sliderOffset}px)`,
                  width: `${duplicatedProducts.length * 320}px`
                }}
              >
                {duplicatedProducts.map((product, index) => {
                  const getProductImage = (product: any) => {
                    if (product.image_url) {
                      return product.image_url.startsWith('http') 
                        ? product.image_url 
                        : `https://cdn.poehali.dev/${product.image_url}`;
                    }
                    const images = [
                      'https://cdn.poehali.dev/projects/f7df5c93-3ffb-476e-bc55-4da98f7f2c0a/files/bb10f9c9-ec03-4dae-852d-ab8eb7cb81c7.jpg',
                      'https://cdn.poehali.dev/projects/f7df5c93-3ffb-476e-bc55-4da98f7f2c0a/files/11810e39-9f5c-43b4-979a-e723f231c489.jpg',
                      'https://cdn.poehali.dev/projects/f7df5c93-3ffb-476e-bc55-4da98f7f2c0a/files/825e48c1-6cd6-4d1f-9d28-ff9464fff64f.jpg',
                    ];
                    return images[product.id % images.length];
                  };

                  return (
                    <Card 
                      key={`${product.id}-${index}`} 
                      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
                      style={{ width: '300px' }}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square rounded-lg mb-4 relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                          <img 
                            src={getProductImage(product)} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => addToFavorites(product)}
                          >
                            <Icon name="Heart" size={18} />
                          </Button>
                        </div>
                        <Badge className="mb-2">{product.brand}</Badge>
                        <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3em]">{product.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-4">{product.price.toLocaleString()} ₽</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          className="w-full gradient-teal"
                          onClick={() => addToCart(product)}
                        >
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Почему выбирают нас?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Truck" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
              <p className="text-muted-foreground">Доставим ваш заказ в течение 1-3 дней</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Гарантия качества</h3>
              <p className="text-muted-foreground">Официальная гарантия на все товары</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Headphones" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
              <p className="text-muted-foreground">Всегда готовы помочь с выбором</p>
            </Card>
          </div>
        </section>
      </div>
    );
  };

  const renderCatalogPage = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Каталог товаров</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <Card 
            key={category.id} 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            onClick={() => {
              setSelectedCategory(category.name);
              setCurrentPage('category');
              setPriceRange([0, 200000]);
              setSelectedBrands([]);
              setSortBy('default');
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 gradient-teal rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Icon name={category.icon as any} size={40} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {allProducts.filter(p => p.category === category.name).length} товаров
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContactPage = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Контакты</h1>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="MapPin" className="text-primary" />
              Адрес
            </h3>
            <p className="text-muted-foreground mb-4">
              г. Москва, ул. Примерная, д. 123
            </p>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="Phone" className="text-primary" />
              Телефон
            </h3>
            <p className="text-muted-foreground mb-4">
              8 (800) 555-35-35
            </p>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="Mail" className="text-primary" />
              Email
            </h3>
            <p className="text-muted-foreground">
              info@mixpc.ru
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Напишите нам</h3>
            
            {!currentUser ? (
              <div className="text-center py-8 space-y-4">
                <Icon name="Lock" size={48} className="mx-auto text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Для отправки сообщений необходимо войти в систему
                </p>
                <Button onClick={() => setLoginOpen(true)} className="gradient-teal">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const message = {
                  name: currentUser.name,
                  email: currentUser.email,
                  message: formData.get('message') as string,
                  created_at: new Date().toISOString(),
                  is_read: false
                };
                
                const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                messages.push(message);
                localStorage.setItem('contactMessages', JSON.stringify(messages));
                
                alert('Сообщение отправлено!');
                (e.target as HTMLFormElement).reset();
              }}>
                <div>
                  <Label>Имя</Label>
                  <Input value={currentUser.name} disabled className="bg-muted" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={currentUser.email} disabled className="bg-muted" />
                </div>
                <div>
                  <Label>Сообщение</Label>
                  <Textarea name="message" placeholder="Ваше сообщение..." rows={4} required />
                </div>
                <Button type="submit" className="w-full gradient-teal">
                  Отправить
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAboutPage = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">О нас</h1>
      <Card>
        <CardContent className="p-8 space-y-4">
          <p className="text-lg">
            <strong>MIX PC</strong> — это современный интернет-магазин компьютерной техники и комплектующих, 
            который работает на рынке с 2015 года.
          </p>
          <p>
            Мы специализируемся на продаже высококачественных комплектующих для сборки компьютеров, 
            ноутбуков, периферии и игровых устройств. Наша миссия — предоставить каждому клиенту 
            доступ к современным технологиям по доступным ценам.
          </p>
          <p>
            В нашем каталоге представлено более 10 000 товаров от ведущих мировых производителей: 
            AMD, Intel, NVIDIA, ASUS, MSI, Corsair, Kingston и многих других.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50 000+</div>
              <div className="text-muted-foreground">Довольных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10 000+</div>
              <div className="text-muted-foreground">Товаров в каталоге</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">8 лет</div>
              <div className="text-muted-foreground">На рынке</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDeliveryPage = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Доставка и оплата</h1>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="Truck" className="text-primary" />
              Способы доставки
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Курьерская доставка по Москве</h4>
                <p className="text-muted-foreground">Стоимость: 500 ₽ | Срок: 1-2 дня</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Доставка по России (СДЭК, Boxberry)</h4>
                <p className="text-muted-foreground">Стоимость: от 300 ₽ | Срок: 3-7 дней</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Самовывоз из пункта выдачи</h4>
                <p className="text-muted-foreground">Бесплатно | г. Москва, ул. Примерная, д. 123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="CreditCard" className="text-primary" />
              Способы оплаты
            </h3>
            <div className="space-y-2">
              <p>• Банковской картой онлайн (Visa, MasterCard, МИР)</p>
              <p>• Наличными при получении</p>
              <p>• Банковским переводом (для юридических лиц)</p>
              <p>• Электронными деньгами (ЮMoney, QIWI)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderWarrantyPage = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Гарантия и возврат</h1>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="Shield" className="text-primary" />
              Гарантийные обязательства
            </h3>
            <div className="space-y-4">
              <p>
                На все товары, приобретенные в нашем магазине, распространяется официальная гарантия производителя.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Сроки гарантии:</h4>
                <p>• Комплектующие (процессоры, видеокарты, память) — от 1 до 3 лет</p>
                <p>• Периферия (клавиатуры, мыши, мониторы) — от 1 до 2 лет</p>
                <p>• Готовые компьютеры — 1 год</p>
              </div>
              <p>
                Гарантийный ремонт осуществляется в авторизованных сервисных центрах производителей.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="RotateCcw" className="text-primary" />
              Возврат товара
            </h3>
            <div className="space-y-4">
              <p>
                Вы можете вернуть товар надлежащего качества в течение 14 дней с момента покупки, 
                если товар не был в употреблении, сохранены его товарный вид, потребительские свойства, 
                пломбы, ярлыки.
              </p>
              <p>
                Товар ненадлежащего качества может быть возвращен в течение всего гарантийного срока.
              </p>
              <p className="text-sm text-muted-foreground">
                * Подробные условия возврата и обмена товаров регулируются Законом РФ "О защите прав потребителей".
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCheckoutPage = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Оформление заказа</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Ваши данные</h2>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              
              if (!currentUser) {
                alert('Войдите в систему для оформления заказа');
                return;
              }
              
              try {
                const response = await fetch('https://functions.poehali.dev/55d2462d-02a8-4732-91f6-95271b22efe9', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    user_id: currentUser.id,
                    full_name: checkoutData.fullName,
                    email: checkoutData.email,
                    phone: checkoutData.phone,
                    delivery_type: checkoutData.deliveryType,
                    delivery_address: checkoutData.address,
                    total_amount: cart.reduce((sum, p) => sum + p.price, 0),
                    items: cart
                  })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                  alert(`Заказ №${data.order_id} успешно оформлен!`);
                  setCart([]);
                  setCurrentPage('home');
                } else {
                  alert('Ошибка при оформлении заказа');
                }
              } catch (error) {
                console.error('Order error:', error);
                alert('Ошибка при оформлении заказа');
              }
            }}>
              <div>
                <Label>ФИО</Label>
                <Input 
                  value={checkoutData.fullName}
                  onChange={(e) => setCheckoutData({...checkoutData, fullName: e.target.value})}
                  placeholder="Иванов Иван Иванович"
                  required 
                />
              </div>
              
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={checkoutData.email}
                  onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                  placeholder="your@email.com"
                  required 
                />
              </div>
              
              <div>
                <Label>Номер телефона</Label>
                <Input 
                  type="tel"
                  value={checkoutData.phone}
                  onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                  placeholder="+7 (999) 123-45-67"
                  required 
                />
              </div>
              
              <div>
                <Label>Способ получения</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="delivery" 
                      value="delivery"
                      checked={checkoutData.deliveryType === 'delivery'}
                      onChange={(e) => setCheckoutData({...checkoutData, deliveryType: e.target.value})}
                    />
                    <span>Доставка</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="delivery" 
                      value="pickup"
                      checked={checkoutData.deliveryType === 'pickup'}
                      onChange={(e) => setCheckoutData({...checkoutData, deliveryType: e.target.value})}
                    />
                    <span>Самовывоз</span>
                  </label>
                </div>
              </div>
              
              {checkoutData.deliveryType === 'delivery' && (
                <div>
                  <Label>Адрес доставки</Label>
                  <Textarea 
                    value={checkoutData.address}
                    onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                    placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                    rows={3}
                    required 
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full h-12 gradient-teal">
                Оформить заказ
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Ваш заказ</h2>
              <div className="space-y-3 mb-4">
                {cart.map(product => (
                  <div key={product.id} className="flex justify-between">
                    <span className="text-sm">{product.name}</span>
                    <span className="font-semibold">{product.price.toLocaleString()} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{cart.reduce((sum, p) => sum + p.price, 0).toLocaleString()} ₽</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Info" size={18} className="text-primary" />
                Информация
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Доставка по Москве — 1-2 дня</p>
                <p>• Самовывоз — бесплатно</p>
                <p>• Гарантия на все товары</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <footer className="footer-dark text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-4">MIX PC</h3>
            <p className="text-white/70 text-sm">Ваш надежный поставщик компьютерных комплектующих с 2025 года</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <div className="space-y-2 text-sm">
              <button onClick={() => setCurrentPage('about')} className="block text-white/70 hover:text-white transition-colors">О нас</button>
              <button onClick={() => setCurrentPage('delivery')} className="block text-white/70 hover:text-white transition-colors">Доставка и оплата</button>
              <button onClick={() => setCurrentPage('warranty')} className="block text-white/70 hover:text-white transition-colors">Гарантия и возврат</button>
              <button onClick={() => setCurrentPage('contact')} className="block text-white/70 hover:text-white transition-colors">Контакты</button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Каталог</h4>
            <div className="space-y-2 text-sm">
              <button onClick={() => { setSelectedCategory('Процессоры'); setCurrentPage('category'); }} className="block text-white/70 hover:text-white transition-colors">Процессоры</button>
              <button onClick={() => { setSelectedCategory('Видеокарты'); setCurrentPage('category'); }} className="block text-white/70 hover:text-white transition-colors">Видеокарты</button>
              <button onClick={() => { setSelectedCategory('Материнские платы'); setCurrentPage('category'); }} className="block text-white/70 hover:text-white transition-colors">Материнские платы</button>
              <button onClick={() => { setSelectedCategory('Оперативная память'); setCurrentPage('category'); }} className="block text-white/70 hover:text-white transition-colors">Оперативная память</button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>8 (800) 555-77-30</p>
              <p>info@mixpc.ru</p>
              <p>г. Ростов-на-дону, Ворошиловский проспект, д. 123</p>
              <div className="flex gap-3 mt-4">
                <a href="https://t.me" target="_blank" rel="noopener" className="text-white hover:opacity-80 transition-opacity">
                  <Icon name="Send" size={20} />
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener" className="text-white hover:opacity-80 transition-opacity">
                  <Icon name="MessageCircle" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60">
          <p>© 2025 MIX PC. Все права защищены.
Создатель Рыбачёк С .С. ВЗПИ 51</p>
        </div>
      </div>
    </footer>
  );

  const renderAdminPage = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Админ-панель</h1>
        
        <Tabs value={adminActiveTab} onValueChange={setAdminActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="orders">Заказы ({adminOrders.length})</TabsTrigger>
            <TabsTrigger value="messages">Сообщения ({adminMessages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Управление товарами</h2>
              <Button onClick={() => setEditingProduct({ name: '', price: 0, brand: '', category: '', image_url: '', description: '', is_featured: false, specifications: [] })} className="gradient-teal">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить товар
              </Button>
            </div>

            {editingProduct && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{editingProduct.id ? 'Редактировать товар' : 'Новый товар'}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Название</Label>
                      <Input 
                        value={editingProduct.name} 
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Цена</Label>
                      <Input 
                        type="number"
                        value={editingProduct.price} 
                        onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Бренд</Label>
                      <Input 
                        value={editingProduct.brand} 
                        onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Категория</Label>
                      <select 
                        className="w-full h-11 rounded-md border border-input bg-background px-3"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Изображение товара</Label>
                      <div className="space-y-2">
                        <Input 
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              const base64 = event.target?.result as string;
                              
                              try {
                                const response = await fetch('https://api.poehali.dev/upload-image', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ image: base64 })
                                });
                                
                                const data = await response.json();
                                setEditingProduct({...editingProduct, image_url: data.url});
                                alert('Изображение загружено!');
                              } catch (error) {
                                console.error('Upload error:', error);
                                alert('Ошибка загрузки изображения');
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                        {editingProduct.image_url && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon name="Check" size={16} className="text-green-600" />
                            <span>Изображение загружено</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label>Описание</Label>
                      <Textarea 
                        value={editingProduct.description || ''} 
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        placeholder="Краткое описание товара"
                        rows={3}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="is_featured"
                          checked={editingProduct.is_featured || false}
                          onCheckedChange={(checked) => setEditingProduct({...editingProduct, is_featured: checked})}
                        />
                        <Label htmlFor="is_featured" className="cursor-pointer">
                          Популярный товар (показывать на главной странице)
                        </Label>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Характеристики товара</Label>
                        <Button 
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const specs = editingProduct.specifications || [];
                            setEditingProduct({
                              ...editingProduct, 
                              specifications: [...specs, { name: '', value: '' }]
                            });
                          }}
                        >
                          <Icon name="Plus" size={16} className="mr-1" />
                          Добавить характеристику
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {(editingProduct.specifications || []).map((spec: any, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <Input 
                              placeholder="Название (например, Гарантия)"
                              value={spec.spec_name || spec.name || ''}
                              onChange={(e) => {
                                const specs = [...(editingProduct.specifications || [])];
                                specs[idx] = { ...specs[idx], name: e.target.value, spec_name: e.target.value };
                                setEditingProduct({...editingProduct, specifications: specs});
                              }}
                              className="flex-1"
                            />
                            <Input 
                              placeholder="Значение (например, 36 мес.)"
                              value={spec.spec_value || spec.value || ''}
                              onChange={(e) => {
                                const specs = [...(editingProduct.specifications || [])];
                                specs[idx] = { ...specs[idx], value: e.target.value, spec_value: e.target.value };
                                setEditingProduct({...editingProduct, specifications: specs});
                              }}
                              className="flex-1"
                            />
                            <Button 
                              size="icon"
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                const specs = [...(editingProduct.specifications || [])];
                                specs.splice(idx, 1);
                                setEditingProduct({...editingProduct, specifications: specs});
                              }}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        ))}
                        
                        {(!editingProduct.specifications || editingProduct.specifications.length === 0) && (
                          <p className="text-sm text-muted-foreground">
                            Характеристик пока нет. Нажмите "Добавить характеристику" чтобы добавить.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleSaveProduct(editingProduct)} className="gradient-teal">
                      Сохранить
                    </Button>
                    <Button onClick={() => setEditingProduct(null)} variant="outline">
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {adminProducts.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Package" size={32} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
                        <p className="text-lg font-bold text-primary">{Number(product.price).toLocaleString()} ₽</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Icon name="Pencil" size={18} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <h2 className="text-2xl font-semibold mb-6">Заказы клиентов</h2>
            
            <div className="grid gap-4">
              {adminOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Заказов пока нет
                  </CardContent>
                </Card>
              ) : (
                adminOrders.map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Заказ №{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <Badge variant={order.status === 'pending' ? 'default' : 'secondary'}>
                          {order.status === 'pending' ? 'Новый' : order.status === 'completed' ? 'Выполнен' : order.status}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Клиент</p>
                          <p className="font-semibold">{order.full_name}</p>
                          <p className="text-sm">{order.email}</p>
                          <p className="text-sm">{order.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Доставка</p>
                          <p className="font-semibold">
                            {order.delivery_type === 'delivery' ? 'Доставка' : 'Самовывоз'}
                          </p>
                          {order.delivery_address && (
                            <p className="text-sm">{order.delivery_address}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-2">Товары:</p>
                        {order.items && order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm mb-1">
                            <span>{item.product_name}</span>
                            <span className="font-semibold">{Number(item.product_price).toLocaleString()} ₽</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
                          <span>Итого:</span>
                          <span className="text-primary">{Number(order.total_amount).toLocaleString()} ₽</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={async () => {
                            await fetch('https://functions.poehali.dev/55d2462d-02a8-4732-91f6-95271b22efe9', {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'X-Admin-Auth': 'admin:123'
                              },
                              body: JSON.stringify({ id: order.id, status: 'completed' })
                            });
                            loadAdminData();
                          }}
                        >
                          Отметить выполненным
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <h2 className="text-2xl font-semibold mb-6">Сообщения от пользователей</h2>
            
            <div className="grid gap-4">
              {adminMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Сообщений пока нет
                  </CardContent>
                </Card>
              ) : (
                adminMessages.map(msg => (
                  <Card key={msg.id} className={msg.is_read ? 'opacity-60' : ''}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{msg.name}</h3>
                          <p className="text-sm text-muted-foreground">{msg.email}</p>
                        </div>
                        <Badge variant={msg.is_read ? 'secondary' : 'default'}>
                          {msg.is_read ? 'Прочитано' : 'Новое'}
                        </Badge>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs text-muted-foreground mt-4">
                        {new Date(msg.created_at).toLocaleString('ru-RU')}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-background flex flex-col">
      {renderHeader()}
      <div className="flex-1">
        {currentPage === 'admin' && isAdmin ? renderAdminPage() :
         currentPage === 'checkout' ? renderCheckoutPage() :
         selectedCategory ? renderCategoryPage() :
         currentPage === 'home' ? renderHomePage() :
         currentPage === 'catalog' ? renderCatalogPage() :
         currentPage === 'about' ? renderAboutPage() :
         currentPage === 'delivery' ? renderDeliveryPage() :
         currentPage === 'warranty' ? renderWarrantyPage() :
         currentPage === 'contact' ? renderContactPage() : null}
      </div>
      {renderFooter()}
    </div>
  );
}