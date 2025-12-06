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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allProductsFromDB, setAllProductsFromDB] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    loadAllProducts();
    loadCategories();
    checkAuth();
    loadFavoritesFromStorage();
    loadOrders();
    loadMessages();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const response = await fetch('https://functions.poehali.dev/9b2ca161-5453-49a5-959c-0d611720a876', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (response.ok && data.user) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setIsAdmin(data.user.role === 'admin');
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/899eeac8-8b43-4e8b-9430-3ba1b8c0ac0b');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    }
  };

  const loadAllProducts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/66eafcf6-38e4-415c-b1ff-ad6d420b564e');
      const products = await response.json();
      
      const formattedProducts = products.map((p: any) => {
        let imageUrl = '/placeholder.jpg';
        
        if (p.image_url || p.image_filename) {
          const img = p.image_url || p.image_filename;
          if (img.startsWith('http')) {
            imageUrl = img;
          } else if (img.startsWith('files/')) {
            imageUrl = `https://cdn.poehali.dev/${img}`;
          } else {
            imageUrl = `https://cdn.poehali.dev/images/${img}`;
          }
        }
        
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          brand: p.brand,
          category: p.category,
          image: imageUrl,
          description: p.description,
          is_featured: p.is_featured,
          specifications: p.specifications || []
        };
      });
      
      setAllProductsFromDB(formattedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      setAllProductsFromDB([]);
    }
  };

  const loadFavoritesFromStorage = () => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/orders-endpoint');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/messages-endpoint');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, product]);
    alert('Товар добавлен в корзину!');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFavorite = (product: any) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === product.id);
      const newFavorites = exists 
        ? prev.filter(f => f.id !== product.id)
        : [...prev, product];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const getFilteredProducts = () => {
    let products = selectedCategory 
      ? allProductsFromDB.filter(p => p.category === selectedCategory)
      : allProductsFromDB;

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
  const availableBrands = selectedCategory
    ? Array.from(new Set(allProductsFromDB.filter(p => p.category === selectedCategory).map(p => p.brand)))
    : [];

  // Navigation Component
  const NavigationMenu = () => (
    <nav className="hidden md:flex items-center gap-6">
      <Button 
        variant={currentPage === 'home' ? 'default' : 'ghost'}
        onClick={() => {
          setCurrentPage('home');
          setSelectedCategory(null);
        }}
      >
        Главная
      </Button>
      <Button 
        variant={currentPage === 'catalog' ? 'default' : 'ghost'}
        onClick={() => setCurrentPage('catalog')}
      >
        Каталог
      </Button>
      <Button 
        variant={currentPage === 'about' ? 'default' : 'ghost'}
        onClick={() => setCurrentPage('about')}
      >
        О нас
      </Button>
      <Button 
        variant={currentPage === 'delivery' ? 'default' : 'ghost'}
        onClick={() => setCurrentPage('delivery')}
      >
        Доставка
      </Button>
      <Button 
        variant={currentPage === 'warranty' ? 'default' : 'ghost'}
        onClick={() => setCurrentPage('warranty')}
      >
        Гарантия
      </Button>
      <Button 
        variant={currentPage === 'contacts' ? 'default' : 'ghost'}
        onClick={() => setCurrentPage('contacts')}
      >
        Контакты
      </Button>
      {isAdmin && (
        <Button 
          variant={currentPage === 'admin' ? 'default' : 'ghost'}
          onClick={() => setCurrentPage('admin')}
        >
          Админ панель
        </Button>
      )}
    </nav>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">MIX PC</h3>
            <p className="text-gray-400">Профессиональная сборка компьютеров и комплектующие</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" onClick={() => setCurrentPage('home')} className="hover:text-white">Главная</a></li>
              <li><a href="#" onClick={() => setCurrentPage('catalog')} className="hover:text-white">Каталог</a></li>
              <li><a href="#" onClick={() => setCurrentPage('about')} className="hover:text-white">О нас</a></li>
              <li><a href="#" onClick={() => setCurrentPage('delivery')} className="hover:text-white">Доставка</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" onClick={() => setCurrentPage('warranty')} className="hover:text-white">Гарантия</a></li>
              <li><a href="#" onClick={() => setCurrentPage('contacts')} className="hover:text-white">Контакты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Телефон: +7 (XXX) XXX-XX-XX</li>
              <li>Email: info@mixpc.ru</li>
              <li>Адрес: г. Москва, ул. Примерная, д. 1</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>2024 MIX PC. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );

  // Page: Home
  const HomePage = () => (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Добро пожаловать в MIX PC</h1>
          <p className="text-xl mb-8">Профессиональная сборка компьютеров и лучшие комплектующие</p>
          <Button size="lg" variant="secondary" onClick={() => setCurrentPage('catalog')}>
            Перейти в каталог
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Рекомендуемые товары</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProductsFromDB.filter(p => p.is_featured).slice(0, 8).map(product => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</p>
              </CardContent>
              <CardFooter className="flex gap-2 p-4 pt-0">
                <Button onClick={() => addToCart(product)} className="flex-1">
                  <Icon name="ShoppingCart" size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toggleFavorite(product)}
                  className={favorites.some(f => f.id === product.id) ? 'text-red-500' : ''}
                >
                  <Icon name="Heart" size={18} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  // Page: Catalog
  const CatalogPage = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Каталог</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <Card 
            key={category.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedCategory(category.name);
              setCurrentPage('category');
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">{category.icon || '📦'}</div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {allProductsFromDB.filter(p => p.category === category.name).length} товаров
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Page: Category
  const CategoryPage = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => setCurrentPage('catalog')}>
          <Icon name="ArrowLeft" size={18} />
          Назад
        </Button>
        <h1 className="text-4xl font-bold">{selectedCategory}</h1>
      </div>

      <div className="flex gap-8">
        <aside className="w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Цена</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={200000}
              step={1000}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{priceRange[0].toLocaleString()} ₽</span>
              <span>{priceRange[1].toLocaleString()} ₽</span>
            </div>
          </div>

          {availableBrands.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Бренд</h3>
              {availableBrands.map(brand => (
                <div key={brand} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => {
                      setSelectedBrands(prev =>
                        checked ? [...prev, brand] : prev.filter(b => b !== brand)
                      );
                    }}
                  />
                  <label className="text-sm">{brand}</label>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-4">Сортировка</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">По умолчанию</SelectItem>
                <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                </CardContent>
                <CardFooter className="flex gap-2 p-4 pt-0">
                  <Button onClick={() => addToCart(product)} className="flex-1">В корзину</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => toggleFavorite(product)}
                    className={favorites.some(f => f.id === product.id) ? 'text-red-500' : ''}
                  >
                    <Icon name="Heart" size={18} />
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedProduct(product)}>
                    <Icon name="Info" size={18} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Page: About
  const AboutPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">О нас</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          MIX PC - это профессиональный магазин компьютерной техники и комплектующих.
          Мы работаем на рынке уже более 10 лет и заслужили доверие тысяч клиентов.
        </p>
        <h2 className="text-2xl font-bold mb-4 mt-8">Наши преимущества</h2>
        <div className="grid md:grid-cols-3 gap-6 my-8">
          <Card>
            <CardContent className="p-6">
              <Icon name="CheckCircle" size={48} className="text-green-500 mb-4" />
              <h3 className="font-bold mb-2">Качество</h3>
              <p>Только оригинальная продукция от проверенных производителей</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Icon name="Truck" size={48} className="text-blue-500 mb-4" />
              <h3 className="font-bold mb-2">Доставка</h3>
              <p>Быстрая доставка по всей России</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Icon name="Shield" size={48} className="text-purple-500 mb-4" />
              <h3 className="font-bold mb-2">Гарантия</h3>
              <p>Официальная гарантия на все товары</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Page: Delivery
  const DeliveryPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Доставка</h1>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Курьерская доставка</h3>
            <p className="mb-2">Доставка по Москве - 500 ₽</p>
            <p className="mb-2">Доставка по МО - от 1000 ₽</p>
            <p className="text-gray-600">Срок доставки: 1-2 дня</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Самовывоз</h3>
            <p className="mb-2">Бесплатно</p>
            <p className="text-gray-600">Адрес: г. Москва, ул. Примерная, д. 1</p>
            <p className="text-gray-600">Режим работы: Пн-Пт 10:00-20:00, Сб-Вс 11:00-18:00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Доставка по России</h3>
            <p className="mb-2">Транспортными компаниями</p>
            <p className="text-gray-600">Стоимость рассчитывается индивидуально</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Page: Warranty
  const WarrantyPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Гарантия</h1>
      <div className="prose max-w-none">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Гарантийные условия</h3>
            <ul className="space-y-2">
              <li>Гарантия на все товары от 12 до 36 месяцев</li>
              <li>Бесплатный ремонт или замена в течение гарантийного срока</li>
              <li>Техническая поддержка 24/7</li>
              <li>Возврат товара в течение 14 дней</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Как воспользоваться гарантией</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Свяжитесь с нашей службой поддержки</li>
              <li>Опишите проблему</li>
              <li>Предоставьте номер заказа и чек</li>
              <li>Привезите товар в сервисный центр или отправьте по почте</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Page: Contacts
  const ContactsPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Контакты</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Контактная информация</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="Phone" size={20} className="mt-1" />
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <p className="text-gray-600">+7 (XXX) XXX-XX-XX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Mail" size={20} className="mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">info@mixpc.ru</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" size={20} className="mt-1" />
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-gray-600">г. Москва, ул. Примерная, д. 1</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Clock" size={20} className="mt-1" />
                  <div>
                    <p className="font-semibold">Режим работы</p>
                    <p className="text-gray-600">Пн-Пт: 10:00-20:00</p>
                    <p className="text-gray-600">Сб-Вс: 11:00-18:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Написать нам</h3>
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
                (e.target as HTMLFormElement).reset();
              }}>
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" name="phone" />
                </div>
                <div>
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea id="message" name="message" rows={5} required />
                </div>
                <Button type="submit" className="w-full">Отправить</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Page: Cart
  const CartPage = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Корзина</h1>
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 mb-4">Корзина пуста</p>
            <Button onClick={() => setCurrentPage('catalog')}>Перейти в каталог</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      <p className="text-lg font-bold text-primary mt-2">{item.price.toLocaleString()} ₽</p>
                    </div>
                    <Button variant="outline" onClick={() => removeFromCart(index)}>
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Итого</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Товары ({cart.length})</span>
                      <span>{total.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Итого</span>
                      <span>{total.toLocaleString()} ₽</span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setCurrentPage('checkout')}>
                    Оформить заказ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Page: Favorites
  const FavoritesPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Избранное</h1>
      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Icon name="Heart" size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600 mb-4">Нет избранных товаров</p>
          <Button onClick={() => setCurrentPage('catalog')}>Перейти в каталог</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map(product => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</p>
              </CardContent>
              <CardFooter className="flex gap-2 p-4 pt-0">
                <Button onClick={() => addToCart(product)} className="flex-1">В корзину</Button>
                <Button variant="outline" onClick={() => toggleFavorite(product)}>
                  <Icon name="Trash2" size={18} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Page: Checkout
  const CheckoutPage = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Оформление заказа</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              alert('Заказ оформлен! Мы свяжемся с вами для подтверждения.');
              setCart([]);
              setCurrentPage('home');
            }}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Контактные данные</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="checkout-name">ФИО</Label>
                      <Input id="checkout-name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="checkout-phone">Телефон</Label>
                      <Input id="checkout-phone" name="phone" type="tel" required />
                    </div>
                    <div>
                      <Label htmlFor="checkout-email">Email</Label>
                      <Input id="checkout-email" name="email" type="email" required />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Доставка</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="delivery-type">Способ доставки</Label>
                      <Select name="deliveryType" defaultValue="courier">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="courier">Курьерская доставка</SelectItem>
                          <SelectItem value="pickup">Самовывоз</SelectItem>
                          <SelectItem value="transport">Транспортная компания</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="address">Адрес доставки</Label>
                      <Input id="address" name="address" required />
                    </div>
                    <div>
                      <Label htmlFor="comment">Комментарий к заказу</Label>
                      <Textarea id="comment" name="comment" rows={3} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Оплата</h3>
                  <Select name="paymentType" defaultValue="cash">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Наличными при получении</SelectItem>
                      <SelectItem value="card">Картой при получении</SelectItem>
                      <SelectItem value="online">Онлайн оплата</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full">
                Подтвердить заказ
              </Button>
            </form>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Ваш заказ</h3>
                <div className="space-y-2 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>{item.price.toLocaleString()} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Итого</span>
                    <span>{total.toLocaleString()} ₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Page: Admin
  const AdminPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Админ панель</h1>
      <Tabs defaultValue="products">
        <TabsList className="mb-8">
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление товарами</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingProduct({
                    name: '',
                    price: 0,
                    brand: '',
                    category: '',
                    description: '',
                    specifications: []
                  })}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct?.id ? 'Редактировать товар' : 'Добавить товар'}
                    </DialogTitle>
                  </DialogHeader>
                  {editingProduct && (
                    <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      
                      const productData = {
                        name: formData.get('name'),
                        price: parseFloat(formData.get('price') as string),
                        brand: formData.get('brand'),
                        category: formData.get('category'),
                        description: formData.get('description'),
                        specifications: []
                      };

                      alert('Товар сохранен!');
                      setEditingProduct(null);
                      loadAllProducts();
                    }}>
                      <div>
                        <Label htmlFor="product-name">Название</Label>
                        <Input id="product-name" name="name" defaultValue={editingProduct.name} required />
                      </div>
                      <div>
                        <Label htmlFor="product-price">Цена</Label>
                        <Input id="product-price" name="price" type="number" defaultValue={editingProduct.price} required />
                      </div>
                      <div>
                        <Label htmlFor="product-brand">Бренд</Label>
                        <Input id="product-brand" name="brand" defaultValue={editingProduct.brand} required />
                      </div>
                      <div>
                        <Label htmlFor="product-category">Категория</Label>
                        <Select name="category" defaultValue={editingProduct.category}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="product-description">Описание</Label>
                        <Textarea id="product-description" name="description" rows={4} defaultValue={editingProduct.description} />
                      </div>
                      <div>
                        <Label>Характеристики</Label>
                        <div className="space-y-2">
                          {editingProduct.specifications?.map((spec: any, index: number) => (
                            <div key={index} className="flex gap-2">
                              <Input placeholder="Название" defaultValue={spec.name} />
                              <Input placeholder="Значение" defaultValue={spec.value} />
                            </div>
                          ))}
                          <Button type="button" variant="outline" size="sm">
                            <Icon name="Plus" size={16} className="mr-2" />
                            Добавить характеристику
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">Сохранить</Button>
                        <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                          Отмена
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {allProductsFromDB.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.brand} - {product.category}</p>
                      <p className="text-lg font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEditingProduct(product)}>
                        <Icon name="Edit" size={18} />
                      </Button>
                      <Button variant="outline" onClick={async () => {
                        if (confirm('Удалить этот товар?')) {
                          alert('Товар удален');
                          loadAllProducts();
                        }
                      }}>
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Заказы</h2>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-600">
                  Заказов пока нет
                </CardContent>
              </Card>
            ) : (
              orders.map(order => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">Заказ #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <Badge>{order.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Клиент:</strong> {order.customerName}</p>
                      <p><strong>Телефон:</strong> {order.phone}</p>
                      <p><strong>Сумма:</strong> {order.total?.toLocaleString()} ₽</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Сообщения</h2>
            {messages.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-600">
                  Сообщений пока нет
                </CardContent>
              </Card>
            ) : (
              messages.map(message => (
                <Card key={message.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">{message.name}</h3>
                        <p className="text-sm text-gray-600">{message.email}</p>
                      </div>
                      <span className="text-sm text-gray-500">{message.date}</span>
                    </div>
                    <p>{message.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div 
                className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setCurrentPage('home');
                  setSelectedCategory(null);
                }}
              >
                MIX PC
              </div>
            </div>

            <NavigationMenu />

            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Icon name="Heart" size={20} />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 px-2 py-0.5 text-xs">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Избранное</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <Button onClick={() => {
                      setCurrentPage('favorites');
                    }} className="w-full">
                      Посмотреть все
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 px-2 py-0.5 text-xs">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-gray-600">Корзина пуста</p>
                    ) : (
                      <>
                        {cart.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold">{item.name}</p>
                              <p className="text-sm text-primary">{item.price.toLocaleString()} ₽</p>
                            </div>
                          </div>
                        ))}
                        <Button onClick={() => setCurrentPage('cart')} className="w-full">
                          Перейти в корзину
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{currentUser?.username}</span>
                  <Button 
                    onClick={() => {
                      localStorage.removeItem('authToken');
                      setIsLoggedIn(false);
                      setIsAdmin(false);
                      setCurrentUser(null);
                      alert('Вы вышли из аккаунта');
                    }}
                    variant="outline"
                  >
                    <Icon name="LogOut" size={18} />
                  </Button>
                </div>
              ) : (
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Icon name="User" size={18} />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      const username = formData.get('login') as string;
                      const password = formData.get('password') as string;
                      
                      try {
                        const response = await fetch('https://functions.poehali.dev/9b2ca161-5453-49a5-959c-0d611720a876', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ username, password })
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok && data.token) {
                          localStorage.setItem('authToken', data.token);
                          setCurrentUser(data.user);
                          setIsLoggedIn(true);
                          setIsAdmin(data.user.role === 'admin');
                          setLoginOpen(false);
                          alert(`Добро пожаловать, ${data.user.username}!`);
                        } else {
                          alert('Неверный логин или пароль');
                        }
                      } catch (error) {
                        alert('Ошибка входа');
                      }
                    }} className="space-y-4">
                      <div>
                        <Label htmlFor="login">Логин</Label>
                        <Input id="login" name="login" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Пароль</Label>
                        <Input id="password" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full">Войти</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'catalog' && <CatalogPage />}
        {currentPage === 'category' && <CategoryPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'delivery' && <DeliveryPage />}
        {currentPage === 'warranty' && <WarrantyPage />}
        {currentPage === 'contacts' && <ContactsPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'favorites' && <FavoritesPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'admin' && isAdmin && <AdminPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full rounded-lg" />
              <div>
                <p className="text-sm text-gray-600 mb-2">{selectedProduct.brand}</p>
                <p className="text-3xl font-bold text-primary mb-4">{selectedProduct.price.toLocaleString()} ₽</p>
                <p className="mb-4">{selectedProduct.description}</p>
                {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Характеристики:</h4>
                    <ul className="space-y-1 text-sm">
                      {selectedProduct.specifications.map((spec: any, index: number) => (
                        <li key={index}>
                          <strong>{spec.name}:</strong> {spec.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }} className="flex-1">
                    Добавить в корзину
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => toggleFavorite(selectedProduct)}
                    className={favorites.some(f => f.id === selectedProduct.id) ? 'text-red-500' : ''}
                  >
                    <Icon name="Heart" size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
