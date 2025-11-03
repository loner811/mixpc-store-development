import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div 
            className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')}
          >
            MIX PC
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-center hidden md:block">
              <div className="font-semibold text-base text-primary">8 (800) 555-77-30</div>
              <div className="flex gap-2 mt-1 justify-center">
                <a href="https://t.me" target="_blank" rel="noopener" className="text-primary hover:opacity-80 transition-opacity">
                  <Icon name="Send" size={20} />
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener" className="text-primary hover:opacity-80 transition-opacity">
                  <Icon name="MessageCircle" size={20} />
                </a>
              </div>
            </div>

            <Button 
              className="gap-2 gradient-teal text-white hover:opacity-90"
              onClick={() => navigate('/configurator')}
            >
              <Icon name="Wrench" size={18} />
              <span className="hidden sm:inline">Конфигуратор</span>
            </Button>

            <Button 
              variant="outline"
              className="gap-2"
              onClick={() => navigate('/my-build')}
            >
              <Icon name="Package" size={18} />
              <span className="hidden sm:inline">Моя сборка</span>
            </Button>

            <Button 
              size="icon" 
              className="gradient-teal text-white hover:opacity-90"
              onClick={() => navigate('/cart')}
            >
              <Icon name="ShoppingCart" size={20} />
            </Button>

            <Button 
              className="gap-2 gradient-teal text-white hover:opacity-90"
              onClick={() => navigate('/')}
            >
              <Icon name="User" size={18} />
              <span className="hidden sm:inline">Войти</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;