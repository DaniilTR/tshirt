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
  const [sortBy, setSortBy] = useState('subscribers');

  // === Обработчики ===
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  // Загружаем ютуберов из API
  useEffect(() => {
    setIsLoading(true);

    fetch('http://localhost:5000/api/creators')
      .then(res => res.json())
      .then(data => {
        setCreators(data);
        setFilteredCreators(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки ютуберов:", err);
        setIsLoading(false);
      });
  }, []);
  

  // Категории для фильтрации (на основе state creators)
  const categories = [
    { value: 'all', label: 'Все категории', count: creators.length },
    { value: 'Gaming', label: 'Геймеры', count: creators.filter(c => c.category === 'Gaming').length },
    { value: 'Entertainment', label: 'Развлечения', count: creators.filter(c => c.category === 'Entertainment').length },
    { value: 'Sports', label: 'Спорт', count: creators.filter(c => c.category === 'Sports').length },
    { value: 'Tech', label: 'Технологии', count: creators.filter(c => c.category === 'Tech').length },
    { value: 'Lifestyle', label: 'Лайфстайл', count: creators.filter(c => c.category === 'Lifestyle').length },
    { value: 'Education', label: 'Образование', count: creators.filter(c => c.category === 'Education').length }
  ];

  // Фильтрация и поиск
  useEffect(() => {
    let filtered = [...creators];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(creator => creator.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(creator => 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

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