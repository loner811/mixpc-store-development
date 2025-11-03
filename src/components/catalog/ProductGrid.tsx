import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Product } from '@/components/home/FeaturedProducts';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Package" size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Товары не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
              onClick={() => onProductClick(product)}
            />
            <div className="p-4">
              <h3 className="font-semibold mb-2 cursor-pointer hover:text-blue-600" onClick={() => onProductClick(product)}>
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
              <p className="text-xl font-bold text-blue-600">{product.price.toLocaleString()} ₽</p>
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
  );
}
