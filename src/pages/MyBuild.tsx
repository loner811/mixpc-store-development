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
  product_name: string;
  price: number;
  product_image: string;
  category_name: string;
  quantity: number;
}

interface Build {
  id: number;
  name: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  items: BuildItem[];
}

const MyBuild = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = localStorage.getItem('userId');

  const [build, setBuild] = useState<Build | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', guestId);
      window.location.reload();
      return;
    }

    loadBuild();
  }, [userId]);

  const loadBuild = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/66eafcf6-38e4-415c-b1ff-ad6d420b564e?action=get_build', {
        headers: { 'X-User-Id': userId || '' }
      });

      if (!response.ok) throw new Error('Ошибка загрузки');

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

      if (!response.ok) throw new Error('Ошибка удаления');

      toast({
        title: 'Успешно',
        description: 'Компонент удалён из сборки'
      });

      loadBuild();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить компонент',
        variant: 'destructive'
      });
    }
  };

  const proceedToCheckout = () => {
    if (!build || build.items.length === 0) {
      toast({
        title: 'Сборка пуста',
        description: 'Добавьте компоненты в конфигураторе',
        variant: 'destructive'
      });
      return;
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-600">Загрузка сборки...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/configurator')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад к конфигуратору
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Моя сборка ПК</h1>
          <p className="text-gray-600">Просмотр и управление вашей конфигурацией</p>
        </div>

        {!build || build.items.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Icon name="Package" size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ваша сборка пока пуста</h3>
              <p className="text-gray-600 mb-6">Начните добавлять компоненты в конфигураторе</p>
              <Button onClick={() => navigate('/configurator')}>
                <Icon name="Wrench" size={20} className="mr-2" />
                Начать сборку
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{build.name}</span>
                    <span className="text-sm text-gray-500">
                      Обновлено: {new Date(build.updated_at).toLocaleDateString('ru-RU')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {build.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      {item.product_image && (
                        <img 
                          src={`https://cdn.poehali.dev/images/${item.product_image}`} 
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">{item.category_name}</div>
                        <h4 className="font-semibold mb-1">{item.product_name}</h4>
                        <p className="text-lg font-bold text-primary">{item.price.toLocaleString('ru-RU')} ₽</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Icon name="Trash2" size={18} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Итого</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Компонентов:</span>
                      <span className="font-semibold">{build.items.length}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Общая стоимость:</span>
                        <span className="text-3xl font-bold text-primary">
                          {build.total_price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={proceedToCheckout}
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Оформить заказ
                  </Button>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate('/configurator')}
                  >
                    <Icon name="Wrench" size={20} className="mr-2" />
                    Изменить сборку
                  </Button>

                  <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    <p className="text-blue-900 font-semibold mb-2">
                      <Icon name="Info" size={16} className="inline mr-1" />
                      Преимущества
                    </p>
                    <ul className="text-blue-700 text-xs space-y-1">
                      <li>✓ Бесплатная сборка</li>
                      <li>✓ Тестирование перед отправкой</li>
                      <li>✓ Гарантия совместимости</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyBuild;