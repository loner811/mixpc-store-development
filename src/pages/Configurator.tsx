import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: string;
  image_url?: string;
}

interface BuildCategory {
  id: number;
  name: string;
  icon: string;
  required: boolean;
  selectedProduct?: Product;
}

const Configurator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = localStorage.getItem('userId');

  const [buildCategories, setBuildCategories] = useState<BuildCategory[]>([
    { id: 2, name: 'Процессоры', icon: 'Cpu', required: true },
    { id: 4, name: 'Материнские платы', icon: 'CircuitBoard', required: true },
    { id: 3, name: 'Видеокарты', icon: 'Zap', required: false },
    { id: 5, name: 'Оперативная память', icon: 'MemoryStick', required: true },
    { id: 6, name: 'Накопители SSD', icon: 'HardDrive', required: true },
    { id: 7, name: 'Блоки питания', icon: 'Battery', required: true },
    { id: 8, name: 'Корпуса', icon: 'Box', required: true },
    { id: 9, name: 'Куллеры', icon: 'Fan', required: false },
  ]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!userId) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему для создания сборки',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }

    loadExistingBuild();
  }, [userId]);

  useEffect(() => {
    calculateTotal();
  }, [buildCategories]);

  const loadExistingBuild = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/66eafcf6-38e4-415c-b1ff-ad6d420b564e?action=get_build', {
        headers: { 'X-User-Id': userId || '' }
      });

      if (!response.ok) return;

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const updatedCategories = buildCategories.map(cat => {
          const item = data.items.find((i: any) => i.category_id === cat.id);
          if (item) {
            return {
              ...cat,
              selectedProduct: {
                id: item.product_id,
                name: item.product_name,
                price: parseFloat(item.price),
                brand: '',
                category: cat.name,
                image_url: item.product_image
              }
            };
          }
          return cat;
        });
        setBuildCategories(updatedCategories);
      }
    } catch (error) {
      console.error('Failed to load build:', error);
    }
  };

  const calculateTotal = () => {
    const total = buildCategories.reduce((sum, cat) => {
      return sum + (cat.selectedProduct?.price || 0);
    }, 0);
    setTotalPrice(total);
  };

  const openCategoryDialog = async (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setLoading(true);

    try {
      const category = buildCategories.find(c => c.id === categoryId);
      const response = await fetch(`https://functions.poehali.dev/66eafcf6-38e4-415c-b1ff-ad6d420b564e?category=${encodeURIComponent(category?.name || '')}`);
      
      if (!response.ok) throw new Error('Ошибка загрузки товаров');

      const products = await response.json();
      setAvailableProducts(products);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить товары',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = async (product: Product) => {
    if (!selectedCategoryId) return;

    try {
      const response = await fetch('https://functions.poehali.dev/66eafcf6-38e4-415c-b1ff-ad6d420b564e', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId || ''
        },
        body: JSON.stringify({
          action: 'add_to_build',
          product_id: product.id,
          category_id: selectedCategoryId
        })
      });

      if (!response.ok) throw new Error('Ошибка добавления');

      const updatedCategories = buildCategories.map(cat => {
        if (cat.id === selectedCategoryId) {
          return { ...cat, selectedProduct: product };
        }
        return cat;
      });

      setBuildCategories(updatedCategories);
      setSelectedCategoryId(null);

      toast({
        title: 'Успешно',
        description: 'Компонент добавлен в сборку'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить компонент',
        variant: 'destructive'
      });
    }
  };

  const removeProduct = (categoryId: number) => {
    const updatedCategories = buildCategories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, selectedProduct: undefined };
      }
      return cat;
    });
    setBuildCategories(updatedCategories);
  };

  const canProceedToCheckout = () => {
    return buildCategories
      .filter(cat => cat.required)
      .every(cat => cat.selectedProduct);
  };

  const handleCheckout = () => {
    if (!canProceedToCheckout()) {
      toast({
        title: 'Не все компоненты выбраны',
        description: 'Выберите все обязательные компоненты для сборки',
        variant: 'destructive'
      });
      return;
    }

    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            На главную
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Конфигуратор ПК</h1>
          <p className="text-gray-600">Соберите свой идеальный компьютер</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {buildCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name={category.icon as any} size={32} className="text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        {category.required && (
                          <Badge variant="destructive" className="text-xs">Обязательно</Badge>
                        )}
                      </div>

                      {category.selectedProduct ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {category.selectedProduct.image_url && (
                                <img 
                                  src={category.selectedProduct.image_url} 
                                  alt={category.selectedProduct.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{category.selectedProduct.name}</p>
                                <p className="text-lg font-bold text-primary mt-1">
                                  {category.selectedProduct.price.toLocaleString('ru-RU')} ₽
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openCategoryDialog(category.id)}
                              >
                                <Icon name="RefreshCw" size={16} className="mr-1" />
                                Изменить
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeProduct(category.id)}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => openCategoryDialog(category.id)}
                        >
                          <Icon name="Plus" size={18} className="mr-2" />
                          Выбрать компонент
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Итоговая сборка</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Компонентов выбрано:</span>
                    <span className="font-semibold">
                      {buildCategories.filter(c => c.selectedProduct).length} / {buildCategories.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Обязательных:</span>
                    <span className="font-semibold">
                      {buildCategories.filter(c => c.required && c.selectedProduct).length} / {buildCategories.filter(c => c.required).length}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Итого:</span>
                    <span className="text-3xl font-bold text-primary">
                      {totalPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <Button 
                    className="w-full mb-3" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={!canProceedToCheckout()}
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Оформить сборку
                  </Button>

                  {!canProceedToCheckout() && (
                    <p className="text-xs text-center text-gray-500">
                      Выберите все обязательные компоненты
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  <p className="text-blue-900 font-semibold mb-2">
                    <Icon name="Info" size={16} className="inline mr-1" />
                    Проверка совместимости
                  </p>
                  <p className="text-blue-700 text-xs">
                    Конфигуратор автоматически проверяет совместимость выбранных компонентов
                  </p>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-green-600" />
                    <span>Гарантия на все компоненты</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-green-600" />
                    <span>Бесплатная сборка и тестирование</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-green-600" />
                    <span>Доставка по всей России</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={selectedCategoryId !== null} onOpenChange={() => setSelectedCategoryId(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Выберите {buildCategories.find(c => c.id === selectedCategoryId)?.name}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {availableProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => selectProduct(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Icon name="Package" size={32} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Badge className="mb-2 text-xs">{product.brand}</Badge>
                        <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h4>
                        <p className="text-xl font-bold text-primary">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Configurator;
