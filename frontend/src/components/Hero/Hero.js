// components/Hero/Hero.js - Главный баннер на главной странице
import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.scss';
import youtobe from '../../img/youtobe.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        {/* Левая часть с текстом */}
        <div className="hero__content">
          <h1 className="hero__title">
            Официальный мерч от 
            <span className="hero__title-accent"> популярных ютуберов</span>
          </h1>
          
          <p className="hero__description">
            Стильные футболки с уникальными дизайнами от твоих любимых создателей контента. 
            Качественная печать, удобная посадка, быстрая доставка.
          </p>

          {/* Кнопки действий */}
          <div className="hero__actions">
            <Link to="/products" className="btn btn--primary hero__btn">
              Смотреть каталог
            </Link>
            <Link to="/creators" className="btn btn--secondary hero__btn">
              Найти ютубера
            </Link>
          </div>

          {/* Преимущества */}
          <div className="hero__features">
            <div className="hero__feature">
              <span className="hero__feature-icon">✅</span>
              <span className="hero__feature-text">Официальный мерч</span>
            </div>
            <div className="hero__feature">
              <span className="hero__feature-icon">🚚</span>
              <span className="hero__feature-text">Быстрая доставка</span>
            </div>
            <div className="hero__feature">
              <span className="hero__feature-icon">👕</span>
              <span className="hero__feature-text">Качественные материалы</span>
            </div>
          </div>
        </div>

        {/* Правая часть с изображением */}
        <div className="hero__image">
          <div className="hero__image-placeholder">
            <div className="hero__shirt-mockup">
                <span className="hero__shirt-text">YOUTUBE</span>
                <img src={youtobe} alt="youtobe" className="logo"/>
            </div>
            
            {/* Декоративные элементы */}
            <div className="hero__decoration hero__decoration--1"></div>
            <div className="hero__decoration hero__decoration--2"></div>
            <div className="hero__decoration hero__decoration--3"></div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="hero__stats">
        <div className="hero__stats-container">
          <div className="hero__stat">
            <span className="hero__stat-number">50+</span>
            <span className="hero__stat-label">Ютуберов</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">10K+</span>
            <span className="hero__stat-label">Довольных клиентов</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">500+</span>
            <span className="hero__stat-label">Дизайнов футболок</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">4.9</span>
            <span className="hero__stat-label">Рейтинг качества</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;