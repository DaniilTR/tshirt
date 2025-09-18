// pages/CreatorsPage/CreatorsPage.js - Страница со списком ютуберов
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CreatorsPage.scss';

const CreatorsPage = () => {
  const [creators, setCreators] = useState([]);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('subscribers'); // subscribers, name, rating, products

  // Демонстрационные данные ютуберов
  const creatorsData = [
    {
      id: 'pewdiepie',
      name: 'PewDiePie',
      realName: 'Felix Kjellberg',
      avatar: '/images/creators/pewdiepie-avatar.jpg',
      subscribers: '111M',
      subscribersCount: 111000000,
      description: 'Самый популярный индивидуальный ютубер в мире! Играю в игры, смотрю мемы.',
      country: 'Швеция',
      category: 'Gaming',
      joinedDate: '2010',
      isVerified: true,
      stats: {
        products: 25,
        totalSales: '50K+',
        rating: 4.9,
        reviews: 1542
      },
      tags: ['Gaming', 'Comedy', 'Memes']
    },
    {
      id: 'mrbeast',
      name: 'MrBeast',
      realName: 'Jimmy Donaldson',
      avatar: '/images/creators/mrbeast-avatar.jpg',
      subscribers: '123M',
      subscribersCount: 123000000,
      description: 'Делаю дорогие видео и раздаю деньги! Известен благотворительными проектами.',
      country: 'США',
      category: 'Entertainment',
      joinedDate: '2012',
      isVerified: true,
      stats: {
        products: 18,
        totalSales: '75K+',
        rating: 4.8,
        reviews: 2341
      },
      tags: ['Entertainment', 'Charity', 'Challenges']
    },
    {
      id: 'dude-perfect',
      name: 'Dude Perfect',
      realName: 'Tyler, Cody, Garrett, Cory, Coby',
      avatar: '/images/creators/dude-perfect-avatar.jpg',
      subscribers: '59M',
      subscribersCount: 59000000,
      description: 'Невероятные трюки, спортивные челленджи и развлекательный контент.',
      country: 'США',
      category: 'Sports',
      joinedDate: '2009',
      isVerified: true,
      stats: {
        products: 15,
        totalSales: '30K+',
        rating: 4.7,
        reviews: 890
      },
      tags: ['Sports', 'Tricks', 'Entertainment']
    },
    {
      id: 'marques-brownlee',
      name: 'Marques Brownlee',
      realName: 'Marques Brownlee',
      avatar: '/images/creators/mkbhd-avatar.jpg',
      subscribers: '18M',
      subscribersCount: 18000000,
      description: 'Обзоры технологий, гаджетов и всего, что связано с tech-миром.',
      country: 'США',
      category: 'Tech',
      joinedDate: '2008',
      isVerified: true,
      stats: {
        products: 12,
        totalSales: '20K+',
        rating: 4.9,
        reviews: 567
      },
      tags: ['Tech', 'Reviews', 'Gadgets']
    },
    {
      id: 'emma-chamberlain',
      name: 'Emma Chamberlain',
      realName: 'Emma Chamberlain',
      avatar: '/images/creators/emma-avatar.jpg',
      subscribers: '12M',
      subscribersCount: 12000000,
      description: 'Lifestyle контент, влоги и все о повседневной жизни миллениала.',
      country: 'США',
      category: 'Lifestyle',
      joinedDate: '2017',
      isVerified: true,
      stats: {
        products: 8,
        totalSales: '15K+',
        rating: 4.6,
        reviews: 334
      },
      tags: ['Lifestyle', 'Fashion', 'Vlogs']
    },
    {
      id: 'kurzgesagt',
      name: 'Kurzgesagt',
      realName: 'Kurzgesagt Team',
      avatar: '/images/creators/kurzgesagt-avatar.jpg',
      subscribers: '20M',
      subscribersCount: 20000000,
      description: 'Образовательные видео о науке, космосе и философии с красивой анимацией.',
      country: 'Германия',
      category: 'Education',
      joinedDate: '2013',
      isVerified: true,
      stats: {
        products: 22,
        totalSales: '25K+',
        rating: 4.8,
        reviews: 756
      },
      tags: ['Education', 'Science', 'Animation']
    }
  ];

  // Категории для фильтрации
  const categories = [
    { value: 'all', label: 'Все категории', count: creatorsData.length },
    { value: 'Gaming', label: 'Геймеры', count: creatorsData.filter(c => c.category === 'Gaming').length },
    { value: 'Entertainment', label: 'Развлечения', count: creatorsData.filter(c => c.category === 'Entertainment').length },
    { value: 'Sports', label: 'Спорт', count: creatorsData.filter(c => c.category === 'Sports').length },
    { value: 'Tech', label: 'Технологии', count: creatorsData.filter(c => c.category === 'Tech').length },
    { value: 'Lifestyle', label: 'Лайфстайл', count: creatorsData.filter(c => c.category === 'Lifestyle').length },
    { value: 'Education', label: 'Образование', count: creatorsData.filter(c => c.category === 'Education').length }
  ];

  // Загрузка данных (имитация API запроса)
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      setCreators(creatorsData);
      setFilteredCreators(creatorsData);
      setIsLoading(false);
    }, 800);
  }, []);

  // Фильтрация и поиск
  useEffect(() => {
    let filtered = creators;

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(creator => creator.category === selectedCategory);
    }

    // Поиск по имени
    if (searchQuery.trim()) {
      filtered = filtered.filter(creator => 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'subscribers':
          return b.subscribersCount - a.subscribersCount;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.stats.rating - a.stats.rating;
        case 'products':
          return b.stats.products - a.stats.products;
        default:
          return 0;
      }
    });

    setFilteredCreators(filtered);
  }, [creators, selectedCategory, searchQuery, sortBy]);

  // Обработчик поиска
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Обработчик смены категории
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Обработчик сортировки
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="creators-page">
        <div className="creators-page__container">
          <div className="creators-page__loading">
            <div className="creators-page__loading-spinner"></div>
            <p>Загружаем ютуберов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="creators-page">
      <div className="creators-page__container">
        {/* Заголовок страницы */}
        <div className="creators-page__header">
          <div className="creators-page__title-section">
            <h1 className="creators-page__title">Наши ютуберы</h1>
            <p className="creators-page__subtitle">
              Откройте для себя мерч от {creators.length} популярных создателей контента
            </p>
          </div>

          {/* Статистика */}
          <div className="creators-page__stats">
            <div className="creators-page__stat">
              <span className="creators-page__stat-number">{creators.length}+</span>
              <span className="creators-page__stat-label">Ютуберов</span>
            </div>
            <div className="creators-page__stat">
              <span className="creators-page__stat-number">500+</span>
              <span className="creators-page__stat-label">Товаров</span>
            </div>
            <div className="creators-page__stat">
              <span className="creators-page__stat-number">4.8</span>
              <span className="creators-page__stat-label">Средний рейтинг</span>
            </div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="creators-page__filters">
          {/* Поиск */}
          <div className="creators-page__search">
            <input
              type="text"
              placeholder="Поиск по имени, категории или тегам..."
              value={searchQuery}
              onChange={handleSearch}
              className="creators-page__search-input"
            />
            <span className="creators-page__search-icon">🔍</span>
          </div>

          {/* Категории */}
          <div className="creators-page__categories">
            {categories.map(category => (
              <button
                key={category.value}
                className={`creators-page__category ${selectedCategory === category.value ? 'creators-page__category--active' : ''}`}
                onClick={() => handleCategoryChange(category.value)}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* Сортировка */}
          <div className="creators-page__sort">
            <label htmlFor="sort-select">Сортировка:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={handleSortChange}
              className="creators-page__sort-select"
            >
              <option value="subscribers">По подписчикам</option>
              <option value="name">По имени</option>
              <option value="rating">По рейтингу</option>
              <option value="products">По количеству товаров</option>
            </select>
          </div>
        </div>

        {/* Результаты поиска */}
        <div className="creators-page__results">
          <p className="creators-page__results-count">
            Найдено: {filteredCreators.length} 
            {filteredCreators.length === 1 ? ' ютубер' : 
             filteredCreators.length < 5 ? ' ютубера' : ' ютуберов'}
          </p>
        </div>

        {/* Сетка ютуберов */}
        {filteredCreators.length === 0 ? (
          <div className="creators-page__no-results">
            <div className="creators-page__no-results-icon">😢</div>
            <h3 className="creators-page__no-results-title">Ютуберы не найдены</h3>
            <p className="creators-page__no-results-description">
              Попробуйте изменить поисковый запрос или фильтры
            </p>
            <button 
              className="btn btn--primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="creators-page__grid">
            {filteredCreators.map(creator => (
              <Link
                key={creator.id}
                to={`/creator/${creator.id}`}
                className="creators-page__creator-card"
              >
                {/* Аватар */}
                <div className="creators-page__creator-avatar">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="creators-page__creator-avatar-placeholder" style={{display: 'none'}}>
                    👤
                  </div>
                  {creator.isVerified && (
                    <span className="creators-page__creator-verified">✅</span>
                  )}
                </div>

                {/* Информация */}
                <div className="creators-page__creator-info">
                  <h3 className="creators-page__creator-name">{creator.name}</h3>
                  <p className="creators-page__creator-real-name">{creator.realName}</p>
                  
                  <div className="creators-page__creator-stats">
                    <div className="creators-page__creator-stat">
                      <span className="creators-page__creator-stat-value">{creator.subscribers}</span>
                      <span className="creators-page__creator-stat-label">подписчиков</span>
                    </div>
                    <div className="creators-page__creator-stat">
                      <span className="creators-page__creator-stat-value">{creator.stats.products}</span>
                      <span className="creators-page__creator-stat-label">товаров</span>
                    </div>
                  </div>

                  <p className="creators-page__creator-description">{creator.description}</p>

                  {/* Теги */}
                  <div className="creators-page__creator-tags">
                    {creator.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="creators-page__creator-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Метаданные */}
                  <div className="creators-page__creator-meta">
                    <span className="creators-page__creator-meta-item">
                      🌍 {creator.country}
                    </span>
                    <span className="creators-page__creator-meta-item">
                      ⭐ {creator.stats.rating}
                    </span>
                    <span className="creators-page__creator-meta-item">
                      📅 с {creator.joinedDate}
                    </span>
                  </div>
                </div>

                {/* Действие при наведении */}
                <div className="creators-page__creator-overlay">
                  <span className="creators-page__creator-action">
                    Перейти к профилю →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Призыв к действию */}
        <div className="creators-page__cta">
          <h2 className="creators-page__cta-title">Хотите стать нашим партнером?</h2>
          <p className="creators-page__cta-description">
            Если у вас есть популярный YouTube канал, присоединяйтесь к нам и начните продавать свой мерч!
          </p>
          <Link to="/become-creator" className="btn btn--primary creators-page__cta-button">
            Стать партнером
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatorsPage;