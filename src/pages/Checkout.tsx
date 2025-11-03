import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const build = location.state?.build;
  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryType: 'pickup',
    address: ''
  });

  const [loading, setLoading] = useState(false);

  if (!build || !userId) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/55d2462d-02a8-4732-91f6-95271b22efe9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          delivery_type: formData.deliveryType,
          delivery_address: formData.address,
          total_amount: build.total_price,
          items: build.items.map((item: any) => ({
            product_id: item.product_id,
            name: item.product_name,
            price: item.price,
            quantity: item.quantity
          })),
          build_id: build.id
        })
      });

      if (!response.ok) throw new Error('Ошибка создания заказа');

      const result = await response.json();

      toast({
        title: 'Заказ оформлен!',
        description: `Номер заказа: ${result.order_id}. Мы свяжемся с вами в ближайшее время.`
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось оформить заказ. Попробуйте ещё раз.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/cart')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад к сборке
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Контактные данные</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">ФИО *</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Иванов Иван Иванович"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@mail.ru"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Способ получения</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.deliveryType}
                    onValueChange={(value) => setFormData({ ...formData, deliveryType: value })}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Самовывоз из магазина</div>
                        <div className="text-sm text-gray-600">Бесплатно</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Доставка курьером</div>
                        <div className="text-sm text-gray-600">Стоимость рассчитывается индивидуально</div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.deliveryType === 'delivery' && (
                    <div className="mt-4">
                      <Label htmlFor="address">Адрес доставки *</Label>
                      <Textarea
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Укажите полный адрес доставки"
                        rows={3}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Оформление...' : 'Подтвердить заказ'}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {build.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <img 
                        src={item.product_image ? `/${item.product_image}` : '/placeholder.svg'} 
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-xs">{item.product_name}</p>
                        <p className="text-primary font-semibold">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товаров:</span>
                    <span>{build.items?.length || 0} шт</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка:</span>
                    <span>{formData.deliveryType === 'pickup' ? 'Бесплатно' : 'По тарифам'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold">Итого:</span>
                    <span className="text-2xl font-bold text-primary">
                      {build.total_price.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
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

export default Checkout;
