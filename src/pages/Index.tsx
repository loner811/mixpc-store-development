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
    <header className="sticky top-0 z-50 gradient-teal shadow-lg">
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

          <div className="flex-1 max-w-xl min-w-[200px]">
            <div className="relative">
              <Input
                placeholder="Поиск по брендам (AMD, Intel, NVIDIA...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-center hidden md:block">
              <div className="font-semibold text-base text-white">8 (800) 555-35-35</div>
              <div className="flex gap-2 mt-1 justify-center">
                <a href="https://t.me" target="_blank" rel="noopener" className="text-white hover:opacity-80 transition-opacity">
                  <Icon name="Send" size={20} />
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener" className="text-white hover:opacity-80 transition-opacity">
                  <Icon name="MessageCircle" size={20} />
                </a>
              </div>
            </div>

            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white text-primary hover:bg-white/90 border-0">
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
                    <div className="space-y-2">
                      <Label>Логин</Label>
                      <Input placeholder="Введите логин" />
                    </div>
                    <div className="space-y-2">
                      <Label>Пароль</Label>
                      <Input type="password" placeholder="Введите пароль" />
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 h-11"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setLoginOpen(false);
                      }}
                    >
                      Войти
                    </Button>
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
                <Button size="icon" className="relative bg-white text-primary hover:bg-white/90 border-0">
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
                <Button size="icon" className="relative bg-white text-primary hover:bg-white/90 border-0">
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
                        <Button className="w-full h-12 text-lg gradient-teal">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-2">
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
            variant={currentPage === 'contact' ? 'default' : 'outline'}
            onClick={() => setCurrentPage('contact')}
            className={currentPage === 'contact' ? 'gradient-teal' : ''}
          >
            Контакты
          </Button>
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
              {filteredProducts.map(product => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <Icon name="Package" size={64} className="text-primary/30" />
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
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHomePage = () => {
    const popularProducts = allProducts.slice(0, 20);
    const duplicatedProducts = [...popularProducts, ...popularProducts, ...popularProducts];

    return (
      <div className="min-h-screen">
        <section className="gradient-teal text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              MIX PC - Ваш надежный поставщик компьютерной техники
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Широкий ассортимент комплектующих и готовых решений по выгодным ценам
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg"
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
                {duplicatedProducts.map((product, index) => (
                  <Card 
                    key={`${product.id}-${index}`} 
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
                    style={{ width: '300px' }}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                        <Icon name="Package" size={64} className="text-primary/30" />
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
                ))}
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
            <form className="space-y-4">
              <div>
                <Label>Имя</Label>
                <Input placeholder="Ваше имя" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Label>Сообщение</Label>
                <Textarea placeholder="Ваше сообщение..." rows={4} />
              </div>
              <Button className="w-full gradient-teal">
                Отправить
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}
      {selectedCategory ? renderCategoryPage() :
       currentPage === 'home' ? renderHomePage() :
       currentPage === 'catalog' ? renderCatalogPage() :
       currentPage === 'contact' ? renderContactPage() : null}
    </div>
  );
}
