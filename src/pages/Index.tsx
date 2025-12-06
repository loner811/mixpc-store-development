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

  useEffect(() => {
    loadAllProducts();
    loadCategories();
    checkAuth();
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

  const addToCart = (product: any) => {
    setCart(prev => [...prev, product]);
    alert('Товар добавлен в корзину!');
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

  return (
    <div className="min-h-screen bg-gray-50">
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

            <div className="flex items-center gap-4">
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
                          alert(data.error || 'Неверный логин или пароль');
                        }
                      } catch (error) {
                        alert('Ошибка подключения к серверу');
                      }
                    }}>
                      <div className="space-y-2">
                        <Label>Логин</Label>
                        <Input name="login" required />
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label>Пароль</Label>
                        <Input name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full mt-4">
                        Войти
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              <Button 
                variant="outline" 
                onClick={() => setCurrentPage('favorites')}
              >
                <Icon name="Heart" size={18} />
                {favorites.length > 0 && <Badge className="ml-2">{favorites.length}</Badge>}
              </Button>

              <Button 
                onClick={() => setCurrentPage('cart')}
              >
                <Icon name="ShoppingCart" size={18} />
                {cart.length > 0 && <Badge className="ml-2">{cart.length}</Badge>}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div>
            <section className="text-white py-32 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg mb-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-6">MIX PC</h1>
                <p className="text-xl mb-8">Интернет-магазин компьютерной техники</p>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600"
                  onClick={() => setCurrentPage('catalog')}
                >
                  Перейти в каталог
                </Button>
              </div>
            </section>

            <h2 className="text-3xl font-bold mb-6">Популярные товары</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allProductsFromDB.filter(p => p.is_featured).slice(0, 8).map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-lg mb-4 bg-gray-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge className="mb-2">{product.brand}</Badge>
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full"
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
        )}

        {currentPage === 'catalog' && (
          <div>
            <h1 className="text-4xl font-bold mb-8">Каталог товаров</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map(category => (
                <Card 
                  key={category.id} 
                  className="cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setCurrentPage('category');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <Icon name={category.icon as any} size={40} className="mx-auto mb-4" />
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'category' && selectedCategory && (
          <div>
            <h1 className="text-3xl font-bold mb-6">{selectedCategory}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-lg mb-4 bg-gray-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge className="mb-2">{product.brand}</Badge>
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full"
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
        )}

        {currentPage === 'cart' && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Корзина</h1>
            {cart.length === 0 ? (
              <p>Корзина пуста</p>
            ) : (
              <div>
                {cart.map((product, idx) => (
                  <Card key={idx} className="mb-4">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-lg font-bold">{product.price.toLocaleString()} ₽</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                      >
                        <Icon name="X" size={18} />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <div className="mt-6 text-right">
                  <p className="text-2xl font-bold">
                    Итого: {cart.reduce((sum, p) => sum + p.price, 0).toLocaleString()} ₽
                  </p>
                  <Button className="mt-4" size="lg">
                    Оформить заказ
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'favorites' && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Избранное</h1>
            {favorites.length === 0 ? (
              <p>Избранное пусто</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map(product => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="aspect-square rounded-lg mb-4 bg-gray-100 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Badge className="mb-2">{product.brand}</Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => addToCart(product)}
                      >
                        <Icon name="ShoppingCart" size={18} />
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => toggleFavorite(product)}
                      >
                        <Icon name="X" size={18} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
