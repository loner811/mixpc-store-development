import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const sampleProducts = [
  { id: 1, name: 'AMD Ryzen 9 7950X', price: 45990, brand: 'AMD', category: 'Процессоры', image: '' },
  { id: 2, name: 'Intel Core i9-13900K', price: 52990, brand: 'Intel', category: 'Процессоры', image: '' },
  { id: 3, name: 'NVIDIA GeForce RTX 4090', price: 159990, brand: 'NVIDIA', category: 'Видеокарты', image: '' },
  { id: 4, name: 'AMD Radeon RX 7900 XTX', price: 89990, brand: 'AMD', category: 'Видеокарты', image: '' },
  { id: 5, name: 'Kingston Fury 32GB DDR5', price: 12990, brand: 'Kingston', category: 'Оперативная память', image: '' },
  { id: 6, name: 'Samsung 980 PRO 2TB', price: 18990, brand: 'Samsung', category: 'Накопители SSD', image: '' },
  { id: 7, name: 'ASUS ROG Strix B650', price: 24990, brand: 'ASUS', category: 'Материнские платы', image: '' },
  { id: 8, name: 'Corsair RM850x', price: 14990, brand: 'Corsair', category: 'Блоки питания', image: '' }
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const filteredProducts = searchQuery
    ? sampleProducts.filter(p => p.brand.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : sampleProducts;

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
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="gradient-orange-blue text-white px-6 py-3 rounded-xl font-bold text-2xl shadow-lg">
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
              <div className="font-semibold text-base">8 (800) 555-35-35</div>
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
                <Button variant="outline" className="gap-2">
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
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="Heart" size={20} />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white">
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
                      <p className="text-center text-muted-foreground text-lg">
                        В вашем избранном нет товаров.<br />Перейдите в каталог.
                      </p>
                    </div>
                  ) : (
                    favorites.map(product => (
                      <Card key={product.id}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg">{product.name}</h4>
                          <Badge className="mt-2">{product.brand}</Badge>
                          <p className="text-primary font-bold text-xl mt-2">{product.price.toLocaleString()} ₽</p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => addToCart(product)}
                            >
                              В корзину
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFromFavorites(product.id)}
                            >
                              <Icon name="Trash2" size={16} />
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
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground text-lg">Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((product, idx) => (
                        <Card key={idx}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-lg">{product.name}</h4>
                            <Badge className="mt-2">{product.brand}</Badge>
                            <p className="text-primary font-bold text-xl mt-2">{product.price.toLocaleString()} ₽</p>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="mt-3 w-full"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Icon name="Trash2" size={16} className="mr-2" />
                              Удалить
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
                    <p className="text-xl font-bold mb-3">
                      Итого: {cart.reduce((sum, p) => sum + p.price, 0).toLocaleString()} ₽
                    </p>
                    <Button className="w-full bg-secondary hover:bg-secondary/90 h-12 text-base">
                      Перейти к оформлению
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <nav className="mt-4 border-t pt-4">
          <ul className="flex gap-6 justify-center flex-wrap">
            {['О Компании', 'Каталог', 'Доставка', 'Гарантия', 'Оплата', 'Контакты'].map(item => (
              <li key={item}>
                <button
                  onClick={() => setCurrentPage(item.toLowerCase().replace(' ', '-'))}
                  className={`font-medium transition-colors hover:text-primary ${
                    currentPage === item.toLowerCase().replace(' ', '-') ? 'text-primary' : ''
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

  const renderHomePage = () => (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 md:order-1">
            <div className="w-72 h-72 gradient-orange-blue rounded-3xl flex items-center justify-center text-white shadow-2xl hover-scale">
              <Icon name="MonitorSmartphone" size={140} />
            </div>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h1 className="text-5xl md:text-6xl font-bold">MIX PC</h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary">Компьютерные комплектующие</h2>
            <p className="text-lg leading-relaxed">
              Мы — современный интернет-магазин компьютерной техники и комплектующих. 
              Предлагаем широкий ассортимент процессоров, видеокарт, материнских плат, 
              оперативной памяти и других компонентов от ведущих производителей.
            </p>
            <p className="text-lg leading-relaxed">
              Наша цель — предоставить вам качественное оборудование по выгодным ценам 
              с гарантией и профессиональной поддержкой. Доставка по всей России!
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 h-14 shadow-lg"
              onClick={() => setCurrentPage('каталог')}
            >
              Перейти в каталог
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: 'Truck', title: 'Доставка', desc: 'По всей России' },
            { icon: 'Shield', title: 'Гарантия', desc: 'До 3 лет' },
            { icon: 'CreditCard', title: 'Оплата', desc: 'Любым способом' },
            { icon: 'Headphones', title: 'Поддержка', desc: '24/7' }
          ].map((item, idx) => (
            <Card key={idx} className="hover-scale">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-3 gradient-orange-blue rounded-xl flex items-center justify-center text-white">
                  <Icon name={item.icon} size={28} />
                </div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCatalogPage = () => (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Каталог товаров</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {categories.map(category => (
            <Card key={category.id} className="hover-scale cursor-pointer group border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 gradient-orange-blue rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                  <Icon name={category.icon} size={32} />
                </div>
                <h3 className="font-semibold text-sm md:text-base">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="border-t pt-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            {searchQuery ? `Результаты поиска: ${searchQuery}` : 'Популярные товары'}
          </h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="SearchX" size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">По вашему запросу ничего не найдено</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="group relative overflow-hidden hover-scale">
                  <CardContent className="p-0">
                    <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                      <Icon name="Cpu" size={80} className="text-gray-400" />
                      <button
                        onClick={() => addToFavorites(product)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <Icon 
                          name="Heart" 
                          size={20} 
                          className={favorites.find(f => f.id === product.id) ? 'fill-red-500 text-red-500' : ''} 
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <Badge className="mb-2">{product.brand}</Badge>
                      <h3 className="font-semibold mb-2 min-h-[3rem]">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary mb-4">
                        {product.price.toLocaleString()} ₽
                      </p>
                      <Button 
                        className="w-full bg-secondary hover:bg-secondary/90 h-11"
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
          )}
        </div>
      </div>
    </div>
  );

  const renderDeliveryPage = () => (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Доставка</h1>
        <div className="space-y-6">
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="Truck" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Доставка по России</h3>
                  <p className="text-base leading-relaxed">Доставляем заказы во все регионы России. Сроки доставки составляют от 1 до 7 дней в зависимости от региона.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="MapPin" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Самовывоз</h3>
                  <p className="text-base leading-relaxed">Вы можете забрать заказ из нашего пункта выдачи в Москве. Адрес: ул. Примерная, д. 1. Работаем ежедневно с 10:00 до 20:00.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="DollarSign" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Стоимость доставки</h3>
                  <p className="text-base leading-relaxed">При заказе на сумму от 10 000 рублей — доставка бесплатная! Для заказов меньшей суммы стоимость доставки рассчитывается индивидуально.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderWarrantyPage = () => (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Гарантия</h1>
        <div className="space-y-6">
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="Shield" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Официальная гарантия</h3>
                  <p className="text-base leading-relaxed">На все товары предоставляется официальная гарантия производителя от 1 до 3 лет в зависимости от категории товара.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="RotateCcw" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Обмен и возврат</h3>
                  <p className="text-base leading-relaxed">В течение 14 дней вы можете вернуть товар или обменять его на аналогичный. Товар должен сохранять товарный вид и комплектацию.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="Wrench" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Сервисное обслуживание</h3>
                  <p className="text-base leading-relaxed">При возникновении проблем с товаром мы организуем ремонт в авторизованном сервисном центре или замену на новый.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPaymentPage = () => (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Оплата</h1>
        <div className="space-y-6">
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="CreditCard" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Банковские карты</h3>
                  <p className="text-base leading-relaxed">Принимаем к оплате карты Visa, MasterCard, МИР. Оплата производится через защищенное соединение.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="Wallet" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Электронные кошельки</h3>
                  <p className="text-base leading-relaxed">Поддерживаем оплату через ЮMoney, QIWI, WebMoney и другие популярные платежные системы.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                  <Icon name="Banknote" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Наличные</h3>
                  <p className="text-base leading-relaxed">Оплата наличными доступна при получении заказа курьером или в пункте самовывоза.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderContactsPage = () => (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Контакты</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                    <Icon name="Phone" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Справочная служба</p>
                    <p className="font-bold text-xl">8 (800) 555-35-35</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                    <Icon name="Mail" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Электронная почта</p>
                    <p className="font-bold text-xl">info@mixpc.ru</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="gradient-orange-blue p-3 rounded-xl text-white flex-shrink-0">
                    <Icon name="Clock" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Время работы</p>
                    <p className="font-bold text-xl">Ежедневно 10:00 - 20:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="hover-scale">
            <div className="p-6">
              <h3 className="font-bold text-2xl mb-6 flex items-center gap-2">
                <Icon name="MessageSquare" size={28} className="text-primary" />
                Задать вопрос
              </h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                alert('Спасибо! Ваш вопрос отправлен. Мы свяжемся с вами в ближайшее время.');
              }}>
                <div className="space-y-2">
                  <Label>ФИО</Label>
                  <Input placeholder="Иванов Иван Иванович" required />
                </div>
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input placeholder="+7 (900) 123-45-67" required />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" placeholder="example@mail.ru" required />
                </div>
                <div className="space-y-2">
                  <Label>Вопрос</Label>
                  <Textarea placeholder="Напишите ваш вопрос..." rows={4} required />
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 h-11">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}
      <main className="min-h-[calc(100vh-300px)]">
        {(currentPage === 'home' || currentPage === 'о-компании') && renderHomePage()}
        {currentPage === 'каталог' && renderCatalogPage()}
        {currentPage === 'доставка' && renderDeliveryPage()}
        {currentPage === 'гарантия' && renderWarrantyPage()}
        {currentPage === 'оплата' && renderPaymentPage()}
        {currentPage === 'контакты' && renderContactsPage()}
      </main>
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4">MIX PC</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Современный интернет-магазин компьютерных комплектующих. 
                Качество, надежность, профессионализм.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">Контакты</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">📞 8 (800) 555-35-35</p>
                <p className="text-gray-300">📧 info@mixpc.ru</p>
                <p className="text-gray-300">🕐 Ежедневно 10:00 - 20:00</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">Информация</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('доставка')} className="text-gray-300 hover:text-white transition-colors">Доставка</button></li>
                <li><button onClick={() => setCurrentPage('гарантия')} className="text-gray-300 hover:text-white transition-colors">Гарантия</button></li>
                <li><button onClick={() => setCurrentPage('оплата')} className="text-gray-300 hover:text-white transition-colors">Оплата</button></li>
                <li><button onClick={() => setCurrentPage('контакты')} className="text-gray-300 hover:text-white transition-colors">Контакты</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-lg font-bold mb-1">MIX PC - Компьютерные комплектующие</p>
            <p className="text-sm text-gray-400">© 2025 Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
