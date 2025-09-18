// pages/CreatorProfile/CreatorProfile.js - Страница профиля ютубера
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CreatorProfile.scss';

const CreatorProfile = () => {
  const { id } = useParams(); // Получаем ID ютубера из URL
  const [creator, setCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // products, about, reviews

  // Демонстрационные данные ютуберов
  const creatorsData = {
    'pewdiepie': {
      id: 'pewdiepie',
      name: 'PewDiePie',
      realName: 'Felix Kjellberg',
      avatar: '/images/creators/pewdiepie-avatar.jpg',
      banner: '/images/creators/pewdiepie-banner.jpg',
      subscribers: '111M',
      description: 'Самый популярный индивидуальный ютубер в мире! Играю в игры, смотрю мемы и создаю контент для всех возрастов.',
      country: 'Швеция',
      category: 'Gaming',
      joinedDate: '2010',
      socialLinks: {
        youtube: 'https://youtube.com/@PewDiePie',
        instagram: 'https://instagram.com/pewdiepie',
        twitter: 'https://twitter.com/pewdiepie'
      },
      stats: {
        products: 25,
        totalSales: '50K+',
        rating: 4.9,
        reviews: 1542
      }
    },
    'mrbeast': {
      id: 'mrbeast',
      name: 'MrBeast',
      realName: 'Jimmy Donaldson',
      avatar: '/images/creators/mrbeast-avatar.jpg',
      banner: '/images/creators/mrbeast-banner.jpg',
      subscribers: '123M',
      description: 'Делаю дорогие видео и раздаю деньги! Известен своими благотворительными проектами и невероятными челленджами.',
      country: 'США',
      category: 'Entertainment',
      joinedDate: '2012',
      socialLinks: {
        youtube: 'https://youtube.com/@MrBeast',
        instagram: 'https://instagram.com/mrbeast',
        twitter: 'https://twitter.com/mrbeast'
      },
      stats: {
        products: 18,
        totalSales: '75K+',
        rating: 4.8,
        reviews: 2341
      }
    }
  };

  // Демонстрационные товары
  const productsData = {
    'pewdiepie': [
      {
        id: 1,
        title: 'PewDiePie "Bro Fist" Футболка',
        price: 2990,
        originalPrice: 3490,
        image: '/images/products/pewdiepie-bro-fist.jpg',
        rating: 4.9,
        reviews: 245,
        isNew: false,
        isSale: true
      },
      {
        id: 2,
        title: 'PewDiePie "Wave Check" Футболка',
        price: 2490,
        originalPrice: 2490,
        image: '/images/products/pewdiepie-wave.jpg',
        rating: 4.7,
        reviews: 132,
        isNew: true,
        isSale: false
      },
      {
        id: 3,
        title: 'PewDiePie Logo Худи',
        price: 4290,
        originalPrice: 4290,
        image: '/images/products/pewdiepie-hoodie.jpg',
        rating: 4.8,
        reviews: 189,
        isNew: false,
        isSale: false
      }
    ],
    'mrbeast': [
      {
        id: 4,
        title: 'MrBeast "Beast Mode" Футболка',
        price: 3290,
        originalPrice: 3290,
        image: '/images/products/mrbeast-beast-mode.jpg',
        rating: 4.8,
        reviews: 312,
        isNew: true,
        isSale: false
      },
      {
        id: 5,
        title: 'MrBeast Logo Футболка',
        price: 2990,
        originalPrice: 3490,
        image: '/images/products/mrbeast-logo.jpg',
        rating: 4.9,
        reviews: 428,
        isNew: false,
        isSale: true
      }
    ]
  };

  // Демонстрационные отзывы
  const reviewsData = [
    {
      id: 1,
      userName: 'Алексей М.',
      rating: 5,
      date: '15.11.2024',
      comment: 'Отличная футболка! Качество печати на высоте, материал приятный. Размер подошел идеально.',
      productName: 'PewDiePie "Bro Fist" Футболка',
      verified: true
    },
    {
      id: 2,
      userName: 'Мария К.',
      rating: 4,
      date: '12.11.2024',
      comment: 'Быстрая доставка, хорошая упаковка. Футболка классная, но немного тонковата.',
      productName: 'MrBeast Logo Футболка',
      verified: true
    }
  ];

  // Загрузка данных (имитация API запроса)
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const creatorData = creatorsData[id];
      const creatorProducts = productsData[id] || [];
      
      if (creatorData) {
        setCreator(creatorData);
        setProducts(creatorProducts);
      }
      
      setIsLoading(false);
    }, 500);
  }, [id]);

  // Обработчик добавления в корзину
  const addToCart = (product) => {
    // В реальном проекте здесь будет логика добавления в корзину
    console.log('Добавлен в корзину:', product);
    alert(`"${product.title}" добавлена в корзину!`);
  };

  if (isLoading) {
    return (
      <div className="creator-profile">
        <div className="creator-profile__container">
          <div className="creator-profile__loading">
            <div className="creator-profile__loading-spinner"></div>
            <p>Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="creator-profile">
        <div className="creator-profile__container">
          <div className="creator-profile__not-found">
            <h1>Ютубер не найден</h1>
            <p>Возможно, профиль был удален или URL указан неверно.</p>
            <Link to="/" className="btn btn--primary">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="creator-profile">
      {/* Баннер ютубера */}
      <div className="creator-profile__banner">
        <img 
          src={creator.banner} 
          alt={`${creator.name} banner`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="creator-profile__banner-placeholder" style={{display: 'none'}}>
          📺 {creator.name}
        </div>
      </div>

      <div className="creator-profile__container">
        {/* Информация о ютубере */}
        <div className="creator-profile__header">
          <div className="creator-profile__avatar">
            <img 
              src={creator.avatar} 
              alt={creator.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="creator-profile__avatar-placeholder" style={{display: 'none'}}>
              👤
            </div>
          </div>

          <div className="creator-profile__info">
            <h1 className="creator-profile__name">{creator.name}</h1>
            <p className="creator-profile__real-name">{creator.realName}</p>
            
            <div className="creator-profile__stats">
              <div className="creator-profile__stat">
                <span className="creator-profile__stat-value">{creator.subscribers}</span>
                <span className="creator-profile__stat-label">подписчиков</span>
              </div>
              <div className="creator-profile__stat">
                <span className="creator-profile__stat-value">{creator.stats.products}</span>
                <span className="creator-profile__stat-label">товаров</span>
              </div>
              <div className="creator-profile__stat">
                <span className="creator-profile__stat-value">{creator.stats.totalSales}</span>
                <span className="creator-profile__stat-label">продаж</span>
              </div>
              <div className="creator-profile__stat">
                <span className="creator-profile__stat-value">{creator.stats.rating}</span>
                <span className="creator-profile__stat-label">рейтинг</span>
              </div>
            </div>

            <div className="creator-profile__meta">
              <span className="creator-profile__meta-item">
                🌍 {creator.country}
              </span>
              <span className="creator-profile__meta-item">
                📂 {creator.category}
              </span>
              <span className="creator-profile__meta-item">
                📅 На YouTube с {creator.joinedDate}
              </span>
            </div>

            <div className="creator-profile__social">
              <a href={creator.socialLinks.youtube} className="creator-profile__social-link">
                📺 YouTube
              </a>
              <a href={creator.socialLinks.instagram} className="creator-profile__social-link">
                📷 Instagram
              </a>
              <a href={creator.socialLinks.twitter} className="creator-profile__social-link">
                🐦 Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="creator-profile__tabs">
          <button 
            className={`creator-profile__tab ${activeTab === 'products' ? 'creator-profile__tab--active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Товары ({products.length})
          </button>
          <button 
            className={`creator-profile__tab ${activeTab === 'about' ? 'creator-profile__tab--active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            О канале
          </button>
          <button 
            className={`creator-profile__tab ${activeTab === 'reviews' ? 'creator-profile__tab--active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Отзывы ({creator.stats.reviews})
          </button>
        </div>

        {/* Контент табов */}
        <div className="creator-profile__content">
          {activeTab === 'products' && (
            <div className="creator-profile__products">
              {products.length === 0 ? (
                <div className="creator-profile__no-products">
                  <p>У этого ютубера пока нет товаров</p>
                </div>
              ) : (
                <div className="creator-profile__products-grid">
                  {products.map(product => (
                    <div key={product.id} className="creator-profile__product-card">
                      {/* Бейджи */}
                      <div className="creator-profile__product-badges">
                        {product.isNew && <span className="creator-profile__badge creator-profile__badge--new">Новинка</span>}
                        {product.isSale && <span className="creator-profile__badge creator-profile__badge--sale">Скидка</span>}
                      </div>

                      {/* Изображение */}
                      <div className="creator-profile__product-image">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="creator-profile__product-image-placeholder" style={{display: 'none'}}>
                          👕
                        </div>
                      </div>

                      {/* Информация */}
                      <div className="creator-profile__product-info">
                        <h3 className="creator-profile__product-title">{product.title}</h3>
                        
                        <div className="creator-profile__product-rating">
                          <span className="creator-profile__rating-stars">
                            {'⭐'.repeat(Math.floor(product.rating))}
                          </span>
                          <span className="creator-profile__rating-value">{product.rating}</span>
                          <span className="creator-profile__rating-count">({product.reviews})</span>
                        </div>

                        <div className="creator-profile__product-price">
                          <span className="creator-profile__price-current">{product.price.toLocaleString()} ₽</span>
                          {product.originalPrice !== product.price && (
                            <span className="creator-profile__price-original">{product.originalPrice.toLocaleString()} ₽</span>
                          )}
                        </div>

                        <div className="creator-profile__product-actions">
                          <Link 
                            to={`/product/${product.id}`} 
                            className="btn btn--secondary creator-profile__product-btn"
                          >
                            Подробнее
                          </Link>
                          <button 
                            className="btn btn--primary creator-profile__product-btn"
                            onClick={() => addToCart(product)}
                          >
                            В корзину
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="creator-profile__about">
              <h3>О канале</h3>
              <p className="creator-profile__description">{creator.description}</p>
              
              <div className="creator-profile__achievements">
                <h4>Достижения</h4>
                <div className="creator-profile__achievement-list">
                  <div className="creator-profile__achievement">
                    <span className="creator-profile__achievement-icon">🏆</span>
                    <span className="creator-profile__achievement-text">Алмазная кнопка YouTube</span>
                  </div>
                  <div className="creator-profile__achievement">
                    <span className="creator-profile__achievement-icon">⭐</span>
                    <span className="creator-profile__achievement-text">Топ-10 самых популярных каналов</span>
                  </div>
                  <div className="creator-profile__achievement">
                    <span className="creator-profile__achievement-icon">🎯</span>
                    <span className="creator-profile__achievement-text">Более 100M подписчиков</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="creator-profile__reviews">
              {reviewsData.map(review => (
                <div key={review.id} className="creator-profile__review">
                  <div className="creator-profile__review-header">
                    <div className="creator-profile__review-user">
                      <span className="creator-profile__review-name">{review.userName}</span>
                      {review.verified && <span className="creator-profile__review-verified">✅</span>}
                    </div>
                    <div className="creator-profile__review-meta">
                      <span className="creator-profile__review-rating">
                        {'⭐'.repeat(review.rating)}
                      </span>
                      <span className="creator-profile__review-date">{review.date}</span>
                    </div>
                  </div>
                  <p className="creator-profile__review-comment">{review.comment}</p>
                  <span className="creator-profile__review-product">Товар: {review.productName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;