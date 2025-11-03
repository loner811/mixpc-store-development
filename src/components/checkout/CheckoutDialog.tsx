import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { CartItem } from '@/components/cart/CartSheet';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

export function CheckoutDialog({ isOpen, onClose, cartItems, onClearCart }: CheckoutDialogProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    deliveryType: 'courier',
  });

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Заказ оформлен!\n\nДетали:\n${formData.fullName}\n${formData.email}\n${formData.phone}\n\nДоставка: ${formData.deliveryType}\nАдрес: ${formData.city}, ${formData.address}\n\nСумма: ${totalPrice.toLocaleString()} ₽`);
    onClearCart();
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Оформление заказа</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-bold mb-4">Контактные данные</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">ФИО</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Доставка</h3>
            <Tabs value={formData.deliveryType} onValueChange={(value) => handleInputChange('deliveryType', value)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="courier">
                  <Icon name="Truck" className="mr-2" size={16} />
                  Курьер
                </TabsTrigger>
                <TabsTrigger value="sdek">
                  <Icon name="Package" className="mr-2" size={16} />
                  СДЭК
                </TabsTrigger>
                <TabsTrigger value="boxberry">
                  <Icon name="Package" className="mr-2" size={16} />
                  Boxberry
                </TabsTrigger>
                <TabsTrigger value="pickup">
                  <Icon name="Store" className="mr-2" size={16} />
                  Самовывоз
                </TabsTrigger>
              </TabsList>

              <TabsContent value="courier" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Адрес доставки</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Улица, дом, квартира"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="sdek" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="city-sdek">Город</Label>
                  <Input
                    id="city-sdek"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address-sdek">Адрес пункта выдачи СДЭК</Label>
                  <Input
                    id="address-sdek"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Выберите пункт выдачи"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="boxberry" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="city-boxberry">Город</Label>
                  <Input
                    id="city-boxberry"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address-boxberry">Адрес пункта выдачи Boxberry</Label>
                  <Input
                    id="address-boxberry"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Выберите пункт выдачи"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="pickup" className="mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Наш магазин:</p>
                  <p className="text-sm">г. Москва, ул. Примерная, д. 123</p>
                  <p className="text-sm">Пн-Пт: 10:00-20:00, Сб-Вс: 11:00-18:00</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Товары ({cartItems.length}):</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка:</span>
                <span>{formData.deliveryType === 'pickup' ? 'Бесплатно' : '500 ₽'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span>
                  {(totalPrice + (formData.deliveryType === 'pickup' ? 0 : 500)).toLocaleString()} ₽
                </span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Icon name="CreditCard" className="mr-2" />
              Оформить заказ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
