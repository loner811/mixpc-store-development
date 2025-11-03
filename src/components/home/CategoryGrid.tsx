import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export interface Category {
  id: number;
  name: string;
  icon: string;
}

interface CategoryGridProps {
  categories: Category[];
  onCategorySelect: (categoryName: string) => void;
}

export function CategoryGrid({ categories, onCategorySelect }: CategoryGridProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Категории товаров</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onCategorySelect(category.name)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Icon name={category.icon} size={48} className="text-blue-600 mb-4" />
                <h3 className="text-center text-sm font-medium">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
