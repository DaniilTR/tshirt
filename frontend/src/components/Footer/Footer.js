// components/Footer/Footer.js - Футер сайта
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  // Текущий год для копирайта
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Верхняя часть футера */}
        <div className="footer__top">
          {/* Информация о компании */}
          <div className="footer__section">
            <h3 className="footer__title">TubeShirts</h3>
            <p className="footer__description">
              Официальный мерч от популярных ютуберов. 
              Качественные футболки с уникальными дизайнами.
            </p>
            {/* Социальные сети */}
            <div className="footer__social">
              <a href="#" className="footer__social-link">📘</a>
              <a href="#" className="footer__social-link">📷</a>
              <a href="#" className="footer__social-link">🐦</a>
              <a href="#" className="footer__social-link">📺</a>
            </div>
          </div>

          {/* Каталог */}
          <div className="footer__section">
            <h4 className="footer__subtitle">Каталог</h4>
            <ul className="footer__links">
              <li><Link to="/products" className="footer__link">Все товары</Link></li>
              <li><Link to="/products/new" className="footer__link">Новинки</Link></li>
              <li><Link to="/products/popular" className="footer__link">Популярное</Link></li>
              <li><Link to="/products/sale" className="footer__link">Распродажа</Link></li>
            </ul>
          </div>

          {/* Ютуберы */}
          <div className="footer__section">
            <h4 className="footer__subtitle">Ютуберы</h4>
            <ul className="footer__links">
              <li><Link to="/youtubers/1" className="footer__link">Ивангай</Link></li>
              <li><Link to="/youtubers/2" className="footer__link">КликКлак</Link></li>
              <li><Link to="/youtubers/3" className="footer__link">Дудь</Link></li>
              <li><Link to="/youtubers/4" className="footer__link">The Люся</Link></li>
            </ul>
          </div>

          {/* Поддержка */}
          <div className="footer__section">
            <h4 className="footer__subtitle">Поддержка</h4>
            <ul className="footer__links">
              <li><Link to="/help" className="footer__link">Центр помощи</Link></li>
              <li><Link to="/delivery" className="footer__link">Доставка и оплата</Link></li>
              <li><Link to="/returns" className="footer__link">Возврат</Link></li>
              <li><Link to="/contacts" className="footer__link">Контакты</Link></li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} TubeShirts. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
