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

interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: string;
  image: string;
  image_filename?: string;
  image_url?: string;
  description?: string;
  is_featured?: boolean;
  specifications?: Array<{ spec_name?: string; name?: string; spec_value?: string; value?: string }>;
  in_stock?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function Index() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
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
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [adminActiveTab, setAdminActiveTab] = useState('products');
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  
  // Featured products
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  // All products from database
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Categories from database
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Filters
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>({});

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
    loadCategories();
    loadAllProducts();
    loadFeaturedProducts();
    loadCart();
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      saveCartToBackend();
    }
  }, [cart, isLoggedIn, currentUser]);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('https://functions.poehali.dev/899eeac8-8b43-4e8b-9430-3ba1b8c0ac0b');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };
  
  const loadAllProducts = async () => {
    try {
      setProductsLoading(true);
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
          image_filename: p.image_filename,
          image_url: p.image_url,
          description: p.description,
          is_featured: p.is_featured,
          specifications: p.specifications || [],
          in_stock: p.in_stock
        };
      });
      
      setAllProducts(formattedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      setAllProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };
  
  const loadFeaturedProducts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/cceb4ca9-48f7-4a28-a301-3dd14baa0d71?featured=true');
      const products = await response.json();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    }
  };

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const saveCartToBackend = async () => {
    if (!isLoggedIn || !currentUser) return;
    
    try {
      await fetch('https://functions.poehali.dev/006f7731-8a8c-4a03-bdd0-e1158ba0bfb5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(currentUser.id)
        },
        body: JSON.stringify({ items: cart })
      });
    } catch (error) {
      console.error('Failed to save cart to backend:', error);
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
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'admin:123'
        },
        body: JSON.stringify(product)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        alert(`Ошибка: ${result.error || 'Не удалось сохранить товар'}`);
        return;
      }
      
      alert(product.id ? 'Товар обновлён!' : 'Товар добавлен!');
      await loadAdminData();
      await loadAllProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
      alert('Ошибка при сохранении товара');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    
    await fetch(`https://functions.poehali.dev/858f5e57-c172-4ef7-9a49-0a25a2e84cc5?id=${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Auth': 'admin:123' }
    });
    
    await loadAdminData();
    await loadAllProducts();
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1
        };
        localStorage.setItem('cart', JSON.stringify(newCart));
        return newCart;
      } else {
        const newCart = [...prevCart, { product, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(newCart));
        return newCart;
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === productId);
      
      if (existingItemIndex !== -1) {
        const newCart = [...prevCart];
        if (newCart[existingItemIndex].quantity > 1) {
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity - 1
          };
        } else {
          newCart.splice(existingItemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(newCart));
        return newCart;
      }
      return prevCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getFilteredProducts = () => {
    let products = selectedCategory 
      ? allProducts.filter(p => p.category === selectedCategory)
      : allProducts;

    if (selectedCategory) {
      products = products.filter(p => 
        p.price >= priceRange[0] && p.price <= priceRange[1]
      );

      if (selectedBrands.length > 0) {
        products = products.filter(p => selectedBrands.includes(p.brand));
      }

      if (showInStockOnly) {
        products = products.filter(p => p.in_stock === true);
      }

      if (Object.keys(selectedSpecs).length > 0) {
        products = products.filter(p => {
          const specs = p.specifications || [];
          return Object.entries(selectedSpecs).every(([specName, specValues]) => {
            return specs.some((spec: any) => {
              const name = spec.spec_name || spec.name || '';
              const value = spec.spec_value || spec.value || '';
              return name === specName && specValues.includes(value);
            });
          });
        });
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

  const getSpecsForCategory = () => {
    if (!selectedCategory) return {};
    const products = allProducts.filter(p => p.category === selectedCategory);
    
    const specsMap: Record<string, Set<string>> = {};
    
    products.forEach(product => {
      const specs = product.specifications || [];
      specs.forEach((spec: any) => {
        const name = spec.spec_name || spec.name || '';
        const value = spec.spec_value || spec.value || '';
        
        if (name && value) {
          if (!specsMap[name]) {
            specsMap[name] = new Set();
          }
          specsMap[name].add(value);
        }
      });
    });
    
    const result: Record<string, string[]> = {};
    Object.entries(specsMap).forEach(([name, values]) => {
      result[name] = Array.from(values).sort();
    });
    
    return result;
  };

  const toggleSpec = (specName: string, specValue: string) => {
    setSelectedSpecs(prev => {
      const current = prev[specName] || [];
      if (current.includes(specValue)) {
        const updated = current.filter(v => v !== specValue);
        if (updated.length === 0) {
          const { [specName]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [specName]: updated };
      } else {
        return { ...prev, [specName]: [...current, specValue] };
      }
    });
  };

  const addToFavorites = (product: Product) => {
    if (!favorites.find(f => f.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(favorites.filter(f => f.id !== productId));
  };

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === '123') {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setCurrentUser({ username: 'admin', id: 1 });
      setLoginOpen(false);
      setCurrentPage('admin');
    } else {
      setIsLoggedIn(true);
      setCurrentUser({ username, id: Date.now() });
      setLoginOpen(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleCheckout = async () => {
    if (!checkoutData.fullName || !checkoutData.email || !checkoutData.phone) {
      alert('Заполните все обязательные поля');
      return;
    }

    if (checkoutData.deliveryType === 'delivery' && !checkoutData.address) {
      alert('Укажите адрес доставки');
      return;
    }

    const order = {
      customer_name: checkoutData.fullName,
      customer_email: checkoutData.email,
      customer_phone: checkoutData.phone,
      delivery_type: checkoutData.deliveryType,
      delivery_address: checkoutData.address,
      items: cart.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    try {
      const response = await fetch('https://functions.poehali.dev/55d2462d-02a8-4732-91f6-95271b22efe9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (response.ok) {
        alert('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
        clearCart();
        setCurrentPage('home');
        setCheckoutData({
          fullName: '',
          email: '',
          phone: '',
          deliveryType: 'delivery',
          address: ''
        });
      } else {
        alert('Ошибка при оформлении заказа');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ошибка при оформлении заказа');
    }
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      date: new Date().toISOString()
    };
    
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    alert('Сообщение отправлено!');
    e.currentTarget.reset();
  };

  const getProductDetails = (productId: number) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return null;

    return {
      ...product,
      specs: product.specifications || []
    };
  };

  const renderHomePage = () => (
    <div className="space-y-12">
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white text-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">Компьютерный магазин</h1>
            <p className="text-xl mb-6">Лучшие цены на комплектующие и готовые ПК</p>
            <Button size="lg" variant="secondary" onClick={() => setCurrentPage('catalog')}>
              Перейти в каталог
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Популярные категории</h2>
        {categoriesLoading ? (
          <div className="text-center py-8">Загрузка категорий...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Card 
                key={cat.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setCurrentPage('catalog');
                }}
              >
                <CardContent className="p-6 text-center">
                  <Icon name={cat.icon as any} className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="font-semibold">{cat.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Рекомендуемые товары</h2>
        <div className="relative overflow-hidden">
          <div 
            className="flex gap-4 transition-transform"
            style={{ transform: `translateX(${sliderOffset}px)` }}
          >
            {[...featuredProducts, ...featuredProducts].map((product, idx) => (
              <Card key={`${product.id}-${idx}`} className="min-w-[300px]">
                <CardContent className="p-4">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} ₽</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => addToCart(product)}>
                    <Icon name="ShoppingCart" className="w-4 h-4 mr-2" />
                    В корзину
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderCatalogPage = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {selectedCategory || 'Все товары'}
      </h1>

      {selectedCategory && (
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Все категории
            </Button>
            
            <select 
              className="border rounded px-3 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="name">По названию</option>
            </select>

            <div className="flex items-center gap-2">
              <Checkbox 
                checked={showInStockOnly}
                onCheckedChange={(checked) => setShowInStockOnly(!!checked)}
                id="in-stock"
              />
              <label htmlFor="in-stock">Только в наличии</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="font-bold mb-4">Фильтры</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Цена: {priceRange[0]} - {priceRange[1]} ₽</Label>
                  <Slider
                    min={0}
                    max={200000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>

                {getBrandsForCategory().length > 0 && (
                  <div>
                    <Label className="mb-2 block">Производитель</Label>
                    {getBrandsForCategory().map(brand => (
                      <div key={brand} className="flex items-center gap-2 mb-2">
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                          id={`brand-${brand}`}
                        />
                        <label htmlFor={`brand-${brand}`}>{brand}</label>
                      </div>
                    ))}
                  </div>
                )}

                {Object.entries(getSpecsForCategory()).map(([specName, specValues]) => (
                  <div key={specName}>
                    <Label className="mb-2 block">{specName}</Label>
                    {specValues.map(value => (
                      <div key={value} className="flex items-center gap-2 mb-2">
                        <Checkbox
                          checked={selectedSpecs[specName]?.includes(value) || false}
                          onCheckedChange={() => toggleSpec(specName, value)}
                          id={`spec-${specName}-${value}`}
                        />
                        <label htmlFor={`spec-${specName}-${value}`}>{value}</label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>

            <div className="md:col-span-3">
              {productsLoading ? (
                <div className="text-center py-8">Загрузка товаров...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">Товары не найдены</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
                        <Badge className="mb-2">{product.category}</Badge>
                        <h3 className="font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        {product.specifications && product.specifications.length > 0 && (
                          <ul className="text-sm text-gray-600 mb-2 space-y-1">
                            {product.specifications.slice(0, 3).map((spec: any, idx: number) => (
                              <li key={idx}>• {spec.spec_value || spec.value}</li>
                            ))}
                          </ul>
                        )}
                        <p className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} ₽</p>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                              <Icon name="Eye" className="w-4 h-4 mr-2" />
                              Подробнее
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{product.name}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                              <img src={product.image} alt={product.name} className="w-full rounded" />
                              <div>
                                <p className="text-3xl font-bold text-blue-600 mb-4">{product.price.toLocaleString()} ₽</p>
                                <p className="text-gray-600 mb-4">{product.description}</p>
                                {product.specifications && product.specifications.length > 0 && (
                                  <div>
                                    <h4 className="font-bold mb-2">Характеристики:</h4>
                                    <ul className="space-y-1">
                                      {product.specifications.map((spec: any, idx: number) => (
                                        <li key={idx} className="text-sm">
                                          • {spec.spec_name || spec.name}: {spec.spec_value || spec.value}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                <Button className="w-full mt-4" onClick={() => addToCart(product)}>
                                  <Icon name="ShoppingCart" className="w-4 h-4 mr-2" />
                                  В корзину
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={() => addToCart(product)}>
                          <Icon name="ShoppingCart" className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            if (favorites.find(f => f.id === product.id)) {
                              removeFromFavorites(product.id);
                            } else {
                              addToFavorites(product);
                            }
                          }}
                        >
                          <Icon 
                            name="Heart" 
                            className={`w-4 h-4 ${favorites.find(f => f.id === product.id) ? 'fill-red-500 text-red-500' : ''}`}
                          />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!selectedCategory && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Выберите категорию</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Card 
                key={cat.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCategory(cat.name)}
              >
                <CardContent className="p-6 text-center">
                  <Icon name={cat.icon as any} className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="font-semibold">{cat.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCartPage = () => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Корзина</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="ShoppingCart" className="w-24 h-24 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">Корзина пуста</p>
            <Button className="mt-4" onClick={() => setCurrentPage('catalog')}>
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <Card key={item.product.id}>
                  <CardContent className="p-4 flex gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-gray-600">{item.product.brand}</p>
                      <p className="text-lg font-bold text-blue-600">{item.product.price.toLocaleString()} ₽</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => removeFromCart(item.product.id)}>
                          <Icon name="Minus" className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => addToCart(item.product)}>
                          <Icon name="Plus" className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Сумма: {(item.product.price * item.quantity).toLocaleString()} ₽
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Итого</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                    <span>{total.toLocaleString()} ₽</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Итого:</span>
                      <span>{total.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setCurrentPage('checkout')}>
                  Оформить заказ
                </Button>
                <Button variant="outline" className="w-full mt-2" onClick={clearCart}>
                  Очистить корзину
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderCheckoutPage = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">ФИО *</Label>
              <Input
                id="fullName"
                value={checkoutData.fullName}
                onChange={(e) => setCheckoutData({...checkoutData, fullName: e.target.value})}
                placeholder="Иванов Иван Иванович"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={checkoutData.email}
                onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                placeholder="example@mail.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                value={checkoutData.phone}
                onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                placeholder="+7 (999) 999-99-99"
              />
            </div>
            
            <div>
              <Label>Способ получения</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  variant={checkoutData.deliveryType === 'delivery' ? 'default' : 'outline'}
                  onClick={() => setCheckoutData({...checkoutData, deliveryType: 'delivery'})}
                >
                  Доставка
                </Button>
                <Button
                  variant={checkoutData.deliveryType === 'pickup' ? 'default' : 'outline'}
                  onClick={() => setCheckoutData({...checkoutData, deliveryType: 'pickup'})}
                >
                  Самовывоз
                </Button>
              </div>
            </div>
            
            {checkoutData.deliveryType === 'delivery' && (
              <div>
                <Label htmlFor="address">Адрес доставки *</Label>
                <Textarea
                  id="address"
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                  placeholder="Улица, дом, квартира"
                />
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">Ваш заказ:</h3>
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm mb-1">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{(item.product.price * item.quantity).toLocaleString()} ₽</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Итого:</span>
                <span>{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString()} ₽</span>
              </div>
            </div>

            <Button className="w-full" onClick={handleCheckout}>
              Оформить заказ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContactPage = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Контакты</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon name="Phone" className="w-5 h-5" />
              <span>+7 (999) 123-45-67</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Mail" className="w-5 h-5" />
              <span>info@pcshop.ru</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="MapPin" className="w-5 h-5" />
              <span>г. Москва, ул. Примерная, д. 123</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Напишите нам</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Имя</Label>
              <Input id="contact-name" name="name" required />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="contact-message">Сообщение</Label>
              <Textarea id="contact-message" name="message" required />
            </div>
            <Button type="submit" className="w-full">Отправить</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderFavoritesPage = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Избранное</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Heart" className="w-24 h-24 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600">В избранном пока ничего нет</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favorites.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
                <Badge className="mb-2">{product.category}</Badge>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} ₽</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="flex-1" onClick={() => addToCart(product)}>
                  <Icon name="ShoppingCart" className="w-4 h-4 mr-2" />
                  В корзину
                </Button>
                <Button variant="outline" onClick={() => removeFromFavorites(product.id)}>
                  <Icon name="Trash2" className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderAdminPage = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
      
      <Tabs value={adminActiveTab} onValueChange={setAdminActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="mb-4">
            <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProduct({})}>
                  <Icon name="Plus" className="w-4 h-4 mr-2" />
                  Добавить товар
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingProduct?.id ? 'Редактировать' : 'Добавить'} товар</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Название"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                  <Input
                    placeholder="Цена"
                    type="number"
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  />
                  <Input
                    placeholder="Бренд"
                    value={editingProduct?.brand || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                  />
                  <Input
                    placeholder="Категория"
                    value={editingProduct?.category || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  />
                  <Input
                    placeholder="URL изображения"
                    value={editingProduct?.image_url || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                  />
                  <Textarea
                    placeholder="Описание"
                    value={editingProduct?.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                  <Button onClick={() => handleSaveProduct(editingProduct)}>
                    Сохранить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {adminProducts.map(product => (
              <Card key={product.id}>
                <CardContent className="p-4 flex gap-4">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">{product.brand} - {product.category}</p>
                    <p className="text-lg font-bold">{product.price.toLocaleString()} ₽</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditingProduct(product)}>
                      <Icon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                      <Icon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            {adminOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Заказ #{order.id}</span>
                    <Badge>{order.status}</Badge>
                  </div>
                  <p>Клиент: {order.customer_name}</p>
                  <p>Email: {order.customer_email}</p>
                  <p>Телефон: {order.customer_phone}</p>
                  <p>Доставка: {order.delivery_type === 'delivery' ? 'Доставка' : 'Самовывоз'}</p>
                  {order.delivery_address && <p>Адрес: {order.delivery_address}</p>}
                  <p className="font-bold mt-2">Сумма: {order.total.toLocaleString()} ₽</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="space-y-4">
            {adminMessages.map(msg => (
              <Card key={msg.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">{msg.name}</span>
                    <span className="text-sm text-gray-600">{new Date(msg.date).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{msg.email}</p>
                  <p className="mt-2">{msg.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 
                className="text-2xl font-bold text-blue-600 cursor-pointer"
                onClick={() => {
                  setCurrentPage('home');
                  setSelectedCategory(null);
                }}
              >
                PC Shop
              </h1>
              <nav className="flex gap-6">
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setSelectedCategory(null);
                  }}
                  className={currentPage === 'home' ? 'font-semibold' : ''}
                >
                  Главная
                </button>
                <button
                  onClick={() => setCurrentPage('catalog')}
                  className={currentPage === 'catalog' ? 'font-semibold' : ''}
                >
                  Каталог
                </button>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className={currentPage === 'contact' ? 'font-semibold' : ''}
                >
                  Контакты
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage('favorites')}
              >
                <Icon name="Heart" className="w-5 h-5" />
                {favorites.length > 0 && (
                  <Badge className="ml-2">{favorites.length}</Badge>
                )}
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost">
                    <Icon name="ShoppingCart" className="w-5 h-5" />
                    {cart.length > 0 && (
                      <Badge className="ml-2">{cart.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
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
                        {cart.map(item => (
                          <div key={item.product.id} className="flex gap-2 items-center">
                            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.product.name}</p>
                              <p className="text-sm">{item.product.price.toLocaleString()} ₽ x {item.quantity}</p>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.product.id)}>
                              <Icon name="X" className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between font-bold mb-4">
                            <span>Итого:</span>
                            <span>{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString()} ₽</span>
                          </div>
                          <Button className="w-full" onClick={() => setCurrentPage('cart')}>
                            Перейти в корзину
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{currentUser?.username}</span>
                  {isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage('admin')}>
                      Админ
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Выйти
                  </Button>
                </div>
              ) : (
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Icon name="User" className="w-4 h-4 mr-2" />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleLogin(
                        formData.get('username') as string,
                        formData.get('password') as string
                      );
                    }}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="username">Логин</Label>
                          <Input id="username" name="username" required />
                        </div>
                        <div>
                          <Label htmlFor="password">Пароль</Label>
                          <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">Войти</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'catalog' && renderCatalogPage()}
        {currentPage === 'cart' && renderCartPage()}
        {currentPage === 'checkout' && renderCheckoutPage()}
        {currentPage === 'contact' && renderContactPage()}
        {currentPage === 'favorites' && renderFavoritesPage()}
        {currentPage === 'admin' && isAdmin && renderAdminPage()}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600">2024 PC Shop. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}