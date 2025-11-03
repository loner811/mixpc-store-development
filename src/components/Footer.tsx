import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary to-secondary text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">MIX PC</h3>
            <p className="text-sm opacity-90">
              Ваш надежный партнер в мире компьютерной техники и комплектующих
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-100 transition-opacity">О нас</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Доставка</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Оплата</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Гарантия</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Помощь</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Контакты</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">FAQ</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Возврат товара</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Сервисные центры</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Icon name="Phone" size={16} />
                <span>8 (800) 555-77-30</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Mail" size={16} />
                <span>info@mixpc.ru</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="https://t.me" target="_blank" rel="noopener" className="hover:opacity-100 transition-opacity">
                  <Icon name="Send" size={20} />
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener" className="hover:opacity-100 transition-opacity">
                  <Icon name="MessageCircle" size={20} />
                </a>
                <a href="https://vk.com" target="_blank" rel="noopener" className="hover:opacity-100 transition-opacity">
                  <Icon name="Share2" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-75">
          <p>&copy; 2024 MIX PC. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
