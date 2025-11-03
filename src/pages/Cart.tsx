import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface BuildItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
  category_name: string;
}

interface Build {
  id: number;
  name: string;
  total_price: number;
  items: BuildItem[];
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [build, setBuild] = useState<Build | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему для просмотра сборки',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }

    loadBuild();
  }, [userId]);

  const loadBuild = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/66eafcf6-38e4-415c-b1ff-ad6d420b564e?action=get_build', {
        headers: {
          'X-User-Id': userId || ''
        }
      });

      if (!response.ok) throw new Error('Ошибка загрузки сборки');

      const data = await response.json();
      setBuild(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить сборку',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch('https://functions.poehali.dev/66eafcf6-38e4-415c-b1ff-ad6d420b564e', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId || ''
        },
        body: JSON.stringify({
          action: 'remove_from_build',
          item_id: itemId
        })
      });

      if (!response.ok) throw new Error('Ошибка удаления товара');

      toast({
        title: 'Успешно',
        description: 'Товар удалён из сборки'
      });

      loadBuild();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive'
      });
    }
  };

  const handleCheckout = () => {
    if (!build || !build.items || build.items.length === 0) {
      toast({
        title: 'Сборка пуста',
        description: 'Добавьте товары в сборку',
        variant: 'destructive'
      });
      return;
    }

    navigate('/checkout', { state: { build } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const groupedItems = build?.items?.reduce((acc, item) => {
    if (!acc[item.category_name]) {
      acc[item.category_name] = [];
    }
    acc[item.category_name].push(item);
    return acc;
  }, {} as Record<string, BuildItem[]>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад к конфигуратору
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Моя сборка ПК</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!build?.items || build.items.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="Package" size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Ваша сборка пока пуста</p>
                  <Button onClick={() => navigate('/')}>
                    Начать сборку
                  </Button>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={item.product_image ? `https://cdn.poehali.dev/images/${item.product_image}` : 'https://via.placeholder.com/80'} 
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.product_name}</h3>
                          <p className="text-lg font-bold text-primary mt-1">
                            {item.price.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Icon name="Trash2" size={20} />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Итого</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Компонентов:</span>
                    <span>{build?.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Стоимость:</span>
                    <span>{build?.total_price?.toLocaleString('ru-RU') || 0} ₽</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Итого:</span>
                    <span className="text-2xl font-bold text-primary">
                      {build?.total_price?.toLocaleString('ru-RU') || 0} ₽
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={!build?.items || build.items.length === 0}
                  >
                    Оформить заказ
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  <p className="text-blue-900 font-semibold mb-2">
                    <Icon name="Info" size={16} className="inline mr-1" />
                    Совместимость проверена
                  </p>
                  <p className="text-blue-700 text-xs">
                    Все компоненты в вашей сборке совместимы между собой
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;