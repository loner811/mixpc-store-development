import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  delivery_type: string;
  delivery_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: Array<{
    product_name: string;
    product_price: number;
    quantity: number;
  }>;
}

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'admin:123') {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = () => {
    if (adminPassword === '123') {
      localStorage.setItem('adminAuth', 'admin:123');
      setIsAuthenticated(true);
      loadData();
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный пароль',
        variant: 'destructive'
      });
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, messagesRes] = await Promise.all([
        fetch('https://functions.poehali.dev/55d2462d-02a8-4732-91f6-95271b22efe9', {
          headers: { 'X-Admin-Auth': 'admin:123' }
        }),
        fetch('https://functions.poehali.dev/cef89039-b240-4ef5-bb82-eade4c24411b', {
          headers: { 'X-Admin-Auth': 'admin:123' }
        })
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/55d2462d-02a8-4732-91f6-95271b22efe9', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'admin:123'
        },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });

      if (!response.ok) throw new Error('Ошибка обновления статуса');

      toast({
        title: 'Успешно',
        description: 'Статус заказа обновлён'
      });

      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      pending: { variant: 'secondary', label: 'Ожидает' },
      processing: { variant: 'default', label: 'В обработке' },
      completed: { variant: 'outline', label: 'Завершён' },
      cancelled: { variant: 'destructive', label: 'Отменён' }
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Панель управления</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Введите пароль"
              className="w-full px-4 py-2 border rounded"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button className="w-full" onClick={handleLogin}>
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Панель управления</h1>
            <p className="text-gray-600">Управление заказами и сообщениями</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}>
              <Icon name="RefreshCw" size={20} className="mr-2" />
              Обновить
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('adminAuth');
                setIsAuthenticated(false);
              }}
            >
              <Icon name="LogOut" size={20} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Заказы ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Icon name="Mail" size={18} className="mr-2" />
              Сообщения ({messages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Заказов пока нет</p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Заказ #{order.id}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold mb-1">Клиент:</p>
                        <p className="text-sm">{order.full_name}</p>
                        <p className="text-sm text-gray-600">{order.email}</p>
                        <p className="text-sm text-gray-600">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Доставка:</p>
                        <p className="text-sm">
                          {order.delivery_type === 'pickup' ? 'Самовывоз' : 'Доставка курьером'}
                        </p>
                        {order.delivery_address && (
                          <p className="text-sm text-gray-600">{order.delivery_address}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Товары:</p>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span>{item.product_name} x{item.quantity}</span>
                            <span className="font-semibold">
                              {item.product_price.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Итого:</p>
                        <p className="text-2xl font-bold text-primary">
                          {order.total_amount.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Ожидает</SelectItem>
                          <SelectItem value="processing">В обработке</SelectItem>
                          <SelectItem value="completed">Завершён</SelectItem>
                          <SelectItem value="cancelled">Отменён</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            {messages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="Mail" size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Сообщений пока нет</p>
                </CardContent>
              </Card>
            ) : (
              messages.map((message) => (
                <Card key={message.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{message.name}</CardTitle>
                        <p className="text-sm text-gray-600">{message.email}</p>
                        <p className="text-sm text-gray-600">{message.phone}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(message.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;