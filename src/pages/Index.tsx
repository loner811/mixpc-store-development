import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

const API_URLS = {
  categories: 'https://functions.poehali.dev/899eeac8-8b43-4e8b-9430-3ba1b8c0ac0b',
  products: 'https://functions.poehali.dev/66eafcf6-38e4-415c-b1ff-ad6d420b564e',
  messages: 'https://functions.poehali.dev/cef89039-b240-4ef5-bb82-eade4c24411b'
};

export default function Index() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [adminProductForm, setAdminProductForm] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, priceRange, selectedBrand, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URLS.categories);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async (category?: string) => {
    try {
      const url = category 
        ? `${API_URLS.products}?category=${category}`
        : API_URLS.products;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchMessages = async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch(API_URLS.messages);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.categorySlug === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedBrand && selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    filtered = filtered.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
  };

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setLoginOpen(false);
      fetchMessages();
    } else if (username && password) {
      setIsLoggedIn(true);
      setIsAdmin(false);
      setLoginOpen(false);
    }
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

  const saveProduct = async (productData: any) => {
    try {
      const method = productData.id ? 'PUT' : 'POST';
      await fetch(API_URLS.products, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      fetchProducts();
      setAdminProductForm({});
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const sendMessage = async (formData: any) => {
    try {
      await fetch(API_URLS.messages, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('Спасибо! Ваше сообщение отправлено.');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-50 gradient-blue shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-2xl shadow-lg cursor-pointer"
               onClick={() => { setCurrentPage('home'); setSelectedCategory(null); }}>
            MIX PC
          </div>

          <div className="flex-1 max-w-xl min-w-[200px]">
            <div className="relative">
              <Input
                placeholder="Поиск по брендам (AMD, Intel, NVIDIA...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/90"
              />
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-center hidden md:block">
              <div className="font-semibold text-white">8 (800) 555-35-35</div>
            </div>

            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white text-primary hover:bg-white/90">
                  <Icon name="User" size={18} />
                  <span className="hidden sm:inline">{isLoggedIn ? (isAdmin ? 'Админ' : 'Профиль') : 'Войти'}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Личный кабинет</DialogTitle>
                </DialogHeader>
                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <Input id="username" placeholder="Логин" />
                    <Input id="password" type="password" placeholder="Пароль" />
                    <Button className="w-full" onClick={() => {
                      const username = (document.getElementById('username') as HTMLInputElement).value;
                      const password = (document.getElementById('password') as HTMLInputElement).value;
                      handleLogin(username, password);
                    }}>
                      Войти
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>Вы вошли как: {isAdmin ? 'Администратор' : 'Пользователь'}</p>
                    {isAdmin && (
                      <Button className="w-full" onClick={() => { setCurrentPage('admin'); setLoginOpen(false); }}>
                        Админ-панель
                      </Button>
                    )}
                    <Button variant="outline" className="w-full" onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setLoginOpen(false); }}>
                      Выйти
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="relative bg-white text-primary hover:bg-white/90">
                  <Icon name="Heart" size={20} />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-white">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Избранное</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {favorites.length === 0 ? (
                    <p className="text-center text-muted-foreground">В вашем избранном нет товаров</p>
                  ) : (
                    favorites.map(product => (
                      <Card key={product.id}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-primary font-bold mt-2">{product.price?.toLocaleString()} ₽</p>
                          <Button size="sm" className="mt-2" onClick={() => setFavorites(favorites.filter(f => f.id !== product.id))}>
                            Удалить
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="relative bg-white text-primary hover:bg-white/90">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-white">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map((product, idx) => (
                        <Card key={idx}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-primary font-bold mt-2">{product.price?.toLocaleString()} ₽</p>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="pt-4 border-t">
                        <p className="text-lg font-bold">
                          Итого: {cart.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()} ₽
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <nav className="mt-4 border-t border-white/20 pt-4">
          <ul className="flex gap-6 justify-center flex-wrap">
            {['О Компании', 'Каталог', 'Доставка', 'Гарантия', 'Оплата', 'Контакты'].map(item => (
              <li key={item}>
                <button
                  onClick={() => { setCurrentPage(item.toLowerCase().replace(' ', '-')); setSelectedCategory(null); }}
                  className={`font-medium transition-colors ${
                    currentPage === item.toLowerCase().replace(' ', '-') 
                      ? 'text-white font-bold' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );

  const renderProductSlider = () => {
    const popularProducts = products.filter(p => p.isPopular);
    if (popularProducts.length === 0) return null;

    return (
      <div className="mb-12 overflow-hidden">
        <h2 className="text-3xl font-bold mb-6 text-primary">Популярные товары</h2>
        <div className="flex gap-6 animate-scroll">
          {[...popularProducts, ...popularProducts].map((product, idx) => (
            <Card key={idx} className="flex-shrink-0 w-80 hover-scale bg-white border-primary/20">
              <CardContent className="p-0">
                <div className="h-48 gradient-light-blue flex items-center justify-center">
                  <img 
                    src={`/images/products/${product.image}`} 
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                  />
                  <Icon name="Cpu" size={80} className="text-primary/40 hidden" />
                </div>
                <div className="p-4">
                  <Badge className="bg-primary mb-2">{product.brand}</Badge>
                  <h3 className="font-semibold mb-2 h-12 overflow-hidden">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary">{product.price?.toLocaleString()} ₽</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCategoryPage = () => {
    const brands = Array.from(new Set(filteredProducts.map(p => p.brand).filter(Boolean)));
    const maxPrice = Math.max(...products.map(p => p.price || 0), 200000);

    return (
      <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[calc(100vh-300px)]">
        <div className="container mx-auto px-4">
          <Button variant="outline" className="mb-6" onClick={() => { setSelectedCategory(null); setCurrentPage('каталог'); }}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад в каталог
          </Button>

          <h1 className="text-4xl font-bold mb-8 text-primary">
            {categories.find(c => c.slug === selectedCategory)?.name || 'Товары'}
          </h1>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Фильтры</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Бренд</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Все бренды" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все бренды</SelectItem>
                        {brands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Цена: {priceRange[0]} - {priceRange[1]} ₽</Label>
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={1000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-2"
                    />
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => { setPriceRange([0, maxPrice]); setSelectedBrand('all'); }}>
                    Сбросить фильтры
                  </Button>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="hover-scale bg-white border-primary/20">
                    <CardContent className="p-0">
                      <div className="h-52 gradient-light-blue flex items-center justify-center relative">
                        <img 
                          src={`/images/products/${product.image}`} 
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                        />
                        <Icon name="Cpu" size={80} className="text-primary/40 hidden" />
                        <button
                          onClick={() => addToFavorites(product)}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <Icon 
                            name="Heart" 
                            size={20} 
                            className={favorites.find(f => f.id === product.id) ? 'fill-red-500 text-red-500' : 'text-primary'} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <Badge className="bg-primary mb-2">{product.brand}</Badge>
                        <h3 className="font-semibold mb-2 min-h-[3rem]">{product.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-4">
                          {product.price?.toLocaleString()} ₽
                        </p>
                        <Button 
                          className="w-full bg-secondary hover:bg-secondary/90"
                          onClick={() => addToCart(product)}
                        >
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminPanel = () => {
    if (!isAdmin) return <div className="p-12 text-center">Доступ запрещён</div>;

    return (
      <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[calc(100vh-300px)]">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-8 text-primary">Админ-панель</h1>

          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="products">Управление товарами</TabsTrigger>
              <TabsTrigger value="messages" onClick={fetchMessages}>Сообщения</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card className="p-6 mb-6">
                <h3 className="font-bold text-xl mb-4">Добавить / Редактировать товар</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Название" value={adminProductForm.name || ''} 
                    onChange={(e) => setAdminProductForm({...adminProductForm, name: e.target.value})} />
                  <Input placeholder="Цена" type="number" value={adminProductForm.price || ''} 
                    onChange={(e) => setAdminProductForm({...adminProductForm, price: parseFloat(e.target.value)})} />
                  <Input placeholder="Бренд" value={adminProductForm.brand || ''} 
                    onChange={(e) => setAdminProductForm({...adminProductForm, brand: e.target.value})} />
                  <Input placeholder="Имя файла фото (1.jpg)" value={adminProductForm.image || ''} 
                    onChange={(e) => setAdminProductForm({...adminProductForm, image: e.target.value})} />
                  <Select value={adminProductForm.categorySlug} 
                    onValueChange={(v) => setAdminProductForm({...adminProductForm, categorySlug: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea placeholder="Описание" className="mt-4" value={adminProductForm.description || ''}
                  onChange={(e) => setAdminProductForm({...adminProductForm, description: e.target.value})} />
                <Button className="mt-4" onClick={() => saveProduct(adminProductForm)}>
                  Сохранить товар
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-xl mb-4">Список товаров</h3>
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.brand} - {product.price} ₽</p>
                      </div>
                      <Button size="sm" onClick={() => setAdminProductForm(product)}>
                        Редактировать
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card className="p-6">
                <h3 className="font-bold text-xl mb-4">Сообщения от пользователей</h3>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground">Нет сообщений</p>
                  ) : (
                    messages.map(msg => (
                      <Card key={msg.id} className="p-4">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-semibold">{msg.fullName}</h4>
                          <span className="text-sm text-muted-foreground">{new Date(msg.createdAt).toLocaleString('ru-RU')}</span>
                        </div>
                        <p className="text-sm mb-2">📞 {msg.phone} | ✉️ {msg.email}</p>
                        <p className="text-sm bg-gray-100 p-3 rounded">{msg.message}</p>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  const renderContactsPage = () => (
    <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[calc(100vh-300px)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">Контакты</h1>
        <Card className="p-6">
          <h3 className="font-bold text-xl mb-4">Задать вопрос</h3>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              fullName: (e.target as any).fullName.value,
              phone: (e.target as any).phone.value,
              email: (e.target as any).email.value,
              message: (e.target as any).message.value
            };
            sendMessage(formData);
            (e.target as HTMLFormElement).reset();
          }}>
            <Input name="fullName" placeholder="ФИО" required />
            <Input name="phone" placeholder="Телефон" required />
            <Input name="email" type="email" placeholder="E-mail" required />
            <Textarea name="message" placeholder="Ваш вопрос" required />
            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
              Отправить
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}
      <main>
        {currentPage === 'home' && (
          <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">MIX PC</h1>
                <h2 className="text-3xl font-semibold text-primary mb-6">Компьютерные комплектующие</h2>
                <p className="text-lg max-w-2xl mx-auto">
                  Широкий ассортимент комплектующих от ведущих производителей. Гарантия, доставка по всей России!
                </p>
              </div>
              {renderProductSlider()}
            </div>
          </div>
        )}

        {currentPage === 'каталог' && !selectedCategory && (
          <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-8 text-center text-primary">Каталог товаров</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map(category => (
                  <Card key={category.id} className="hover-scale cursor-pointer" 
                        onClick={() => { setSelectedCategory(category.slug); fetchProducts(category.slug); }}>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 gradient-blue rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Icon name={category.icon} size={32} />
                      </div>
                      <h3 className="font-semibold">{category.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedCategory && renderCategoryPage()}
        {currentPage === 'admin' && renderAdminPanel()}
        {currentPage === 'контакты' && renderContactsPage()}
        {currentPage === 'доставка' && <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[calc(100vh-300px)]"><div className="container mx-auto px-4"><h1 className="text-4xl font-bold mb-8 text-primary">Доставка</h1><p>Информация о доставке...</p></div></div>}
        {currentPage === 'гарантия' && <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[calc(100vh-300px)]"><div className="container mx-auto px-4"><h1 className="text-4xl font-bold mb-8 text-primary">Гарантия</h1><p>Информация о гарантии...</p></div></div>}
        {currentPage === 'оплата' && <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[calc(100vh-300px)]"><div className="container mx-auto px-4"><h1 className="text-4xl font-bold mb-8 text-primary">Оплата</h1><p>Информация об оплате...</p></div></div>}
      </main>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-bold mb-2">MIX PC - Компьютерные комплектующие</p>
          <p className="text-sm text-gray-400">© 2025 Все права защищены</p>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
