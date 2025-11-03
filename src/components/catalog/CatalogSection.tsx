import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { ProductGrid } from './ProductGrid';
import { Product } from '@/components/home/FeaturedProducts';

interface CatalogSectionProps {
  catalogRef: React.RefObject<HTMLDivElement>;
  products: Product[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function CatalogSection({
  catalogRef,
  products,
  selectedCategory,
  onCategorySelect,
  onAddToCart,
  onProductClick,
}: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const categories = ['Компьютеры', 'Процессоры', 'Видеокарты', 'Материнские платы', 'Оперативная память', 'Накопители SSD', 'Блоки питания', 'Корпуса', 'Куллеры', 'Мониторы', 'Клавиатуры', 'Компьютерные мыши'];
  const brands = [...new Set(products.map(p => p.brand))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return matchesCategory && matchesSearch && matchesPrice && matchesBrand;
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <section ref={catalogRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Каталог товаров</h2>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategorySelect(null)}
          >
            Все категории
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">Фильтры</h3>

              <div className="mb-6">
                <Label className="mb-2 block">Цена</Label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={200000}
                    step={1000}
                    className="mb-2"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{priceRange[0].toLocaleString()} ₽</span>
                  <span>{priceRange[1].toLocaleString()} ₽</span>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Бренд</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <label htmlFor={brand} className="text-sm cursor-pointer">{brand}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ProductGrid
              products={filteredProducts}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
