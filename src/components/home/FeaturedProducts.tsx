import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: string;
  image: string;
}

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function FeaturedProducts({ products, onAddToCart, onProductClick }: FeaturedProductsProps) {
  const featuredIds = [21, 11, 31, 41, 51, 61];
  const featuredProducts = products.filter(p => featuredIds.includes(p.id));

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Популярные товары</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-t-lg cursor-pointer"
                    onClick={() => onProductClick(product)}
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500">Хит продаж</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 cursor-pointer hover:text-blue-600" onClick={() => onProductClick(product)}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  <p className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} ₽</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => onAddToCart(product)}>
                  <Icon name="ShoppingCart" className="mr-2" />
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
