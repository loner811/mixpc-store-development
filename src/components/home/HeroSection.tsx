import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  onScrollToCatalog: () => void;
}

export function HeroSection({ onScrollToCatalog }: HeroSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Добро пожаловать в TechStore</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Ваш надежный партнер в мире компьютерных технологий. Широкий ассортимент комплектующих и готовых решений.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="secondary" onClick={onScrollToCatalog}>
            <Icon name="ShoppingCart" className="mr-2" />
            Перейти к каталогу
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
            <Icon name="Info" className="mr-2" />
            О нас
          </Button>
        </div>
      </div>
    </section>
  );
}
