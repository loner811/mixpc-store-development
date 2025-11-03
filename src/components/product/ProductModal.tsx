import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Product } from '@/components/home/FeaturedProducts';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  getProductSpecs: (productId: number, productName: string, category: string) => string[];
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, getProductSpecs }: ProductModalProps) {
  if (!product) return null;

  const specs = getProductSpecs(product.id, product.name, product.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img src={product.image} alt={product.name} className="w-full rounded-lg" />
          </div>
          <div>
            <Badge className="mb-4">{product.category}</Badge>
            <p className="text-sm text-gray-600 mb-4">Бренд: {product.brand}</p>
            <p className="text-3xl font-bold text-blue-600 mb-6">{product.price.toLocaleString()} ₽</p>

            <h3 className="font-bold mb-3">Характеристики:</h3>
            <ul className="space-y-2 mb-6">
              {specs.map((spec, idx) => (
                <li key={idx} className="flex items-start">
                  <Icon name="Check" className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" size="lg" onClick={() => { onAddToCart(product); onClose(); }}>
              <Icon name="ShoppingCart" className="mr-2" />
              Добавить в корзину
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
