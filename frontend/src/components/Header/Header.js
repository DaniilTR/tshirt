// components/Header/Header.js - Шапка сайта с навигацией
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  // Состояние для мобильного меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Состояние для количества товаров в корзине (в реальном проекте из контекста/redux)
  const [cartItemsCount, setCartItemsCount] = useState(3);

  // Обработчик переключения мобильного меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Логотип */}
        <Link to="/" className="header__logo">
          <span className="header__logo-text">TubeShirts</span>
        </Link>

        {/* Основная навигация */}
        <nav className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/" className="header__nav-link">Главная</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/products" className="header__nav-link">Каталог</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/CreatorsPage" className="header__nav-link">Ютуберы</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/about" className="header__nav-link">О нас</Link>
            </li>
          </ul>
        </nav>

        {/* Правая часть хедера */}
        <div className="header__actions">
          {/* Поиск */}
          <div className="header__search">
            <input 
              type="text" 
              placeholder="Поиск футболок..."
              className="header__search-input"
            />
            <button className="header__search-button">
              🔍
            </button>
          </div>

          {/* Корзина */}
          <Link to="/cart" className="header__cart">
            <span className="header__cart-icon">🛒</span>
            {cartItemsCount > 0 && (
              <span className="header__cart-badge">{cartItemsCount}</span>
            )}
          </Link>

          {/* Кнопка входа */}
          <Link to="/login" className="header__login">
            Войти
          </Link>
          {/* Кнопка входа */}
          <Link to="/register" className="header__login">
            Регистрация
          </Link>

          {/* Бургер меню для мобильных */}
          <button 
            className={`header__burger ${isMobileMenuOpen ? 'header__burger--open' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;