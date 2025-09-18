// pages/Cart/Cart.js - Страница корзины покупок
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.scss';

const Cart = () => {
  // Демонстрационные данные корзины (в реальном проекте из контекста/redux)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      productId: 'tshirt-pewdiepie-1',
      title: 'PewDiePie "Bro Fist" Футболка',
      creator: 'PewDiePie',
      price: 2990,
      originalPrice: 3490,
      size: 'L',
      color: 'Черная',
      quantity: 2,
      image: '/images/products/pewdiepie-bro-fist.jpg'
    },
    {
      id: 2,
      productId: 'tshirt-dude-perfect-1',
      title: 'Dude Perfect "Trick Shot" Футболка',
      creator: 'Dude Perfect',
      price: 2790,
      originalPrice: 2790,
      size: 'M',
      color: 'Белая',
      quantity: 1,
      image: '/images/products/dude-perfect-trick.jpg'
    },
    {
      id: 3,
      productId: 'tshirt-mrbeast-1',
      title: 'MrBeast "Beast Mode" Футболка',
      creator: 'MrBeast',
      price: 3290,
      originalPrice: 3290,
      size: 'XL',
      color: 'Синяя',
      quantity: 1,
      image: '/images/products/mrbeast-beast-mode.jpg'
    }
  ]);

  // Промокод
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Обновление количества товара
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Удаление товара из корзины
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Применение промокода
  const applyPromoCode = () => {
    const validPromoCodes = {
      'FIRST10': { discount: 10, type: 'percentage' },
      'SAVE500': { discount: 500, type: 'fixed' }
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...validPromoCodes[promoCode.toUpperCase()]
      });
    } else {
      alert('Промокод не найден');
    }
  };

  // Расчеты стоимости
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalSubtotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const savings = originalSubtotal - subtotal;
  
  // Применение промокода
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      promoDiscount = subtotal * (appliedPromo.discount / 100);
    } else {
      promoDiscount = appliedPromo.discount;
    }
  }
  
  const deliveryFee = subtotal > 5000 ? 0 : 300; // Бесплатная доставка от 5000₽
  const total = subtotal - promoDiscount + deliveryFee;

  return (
    <div className="cart">
      <div className="cart__container">
        <div className="cart__header">
          <h1 className="cart__title">Корзина покупок</h1>
          <span className="cart__items-count">
            {cartItems.length} {cartItems.length === 1 ? 'товар' : 'товара'}
          </span>
        </div>

        {cartItems.length === 0 ? (
          // Пустая корзина
          <div className="cart__empty">
            <div className="cart__empty-icon">🛒</div>
            <h2 className="cart__empty-title">Корзина пустая</h2>
            <p className="cart__empty-description">
              Добавьте товары из каталога, чтобы сделать заказ
            </p>
            <Link to="/products" className="btn btn--primary">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="cart__content">
            {/* Список товаров */}
            <div className="cart__items">
              {cartItems.map(item => (
                <div key={item.id} className="cart__item">
                  {/* Изображение товара */}
                  <div className="cart__item-image">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      onError={(e) => {
                        // Заглушка для изображения, если оно не загружается
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="cart__item-image-placeholder" style={{display: 'none'}}>
                      👕
                    </div>
                  </div>

                  {/* Информация о товаре */}
                  <div className="cart__item-info">
                    <h3 className="cart__item-title">{item.title}</h3>
                    <p className="cart__item-creator">от {item.creator}</p>
                    <div className="cart__item-details">
                      <span className="cart__item-detail">Размер: {item.size}</span>
                      <span className="cart__item-detail">Цвет: {item.color}</span>
                    </div>
                  </div>

                  {/* Управление количеством */}
                  <div className="cart__item-quantity">
                    <button 
                      className="cart__quantity-btn cart__quantity-btn--minus"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="cart__quantity-value">{item.quantity}</span>
                    <button 
                      className="cart__quantity-btn cart__quantity-btn--plus"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Цена */}
                  <div className="cart__item-price">
                    <span className="cart__item-price-current">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </span>
                    {item.originalPrice !== item.price && (
                      <span className="cart__item-price-original">
                        {(item.originalPrice * item.quantity).toLocaleString()} ₽
                      </span>
                    )}
                  </div>

                  {/* Кнопка удаления */}
                  <button 
                    className="cart__item-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Сводка заказа */}
            <div className="cart__summary">
              <div className="cart__summary-card">
                <h3 className="cart__summary-title">Сводка заказа</h3>

                {/* Промокод */}
                <div className="cart__promo">
                  <div className="cart__promo-input">
                    <input 
                      type="text"
                      placeholder="Промокод"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button onClick={applyPromoCode}>Применить</button>
                  </div>
                  {appliedPromo && (
                    <div className="cart__promo-applied">
                      ✅ Промокод {appliedPromo.code} применен
                    </div>
                  )}
                </div>

                {/* Расчеты */}
                <div className="cart__calculations">
                  <div className="cart__calc-row">
                    <span>Подытог:</span>
                    <span>{subtotal.toLocaleString()} ₽</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="cart__calc-row cart__calc-row--savings">
                      <span>Скидка:</span>
                      <span>-{savings.toLocaleString()} ₽</span>
                    </div>
                  )}
                  
                  {appliedPromo && promoDiscount > 0 && (
                    <div className="cart__calc-row cart__calc-row--promo">
                      <span>Промокод {appliedPromo.code}:</span>
                      <span>-{promoDiscount.toLocaleString()} ₽</span>
                    </div>
                  )}
                  
                  <div className="cart__calc-row">
                    <span>Доставка:</span>
                    <span>
                      {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}
                    </span>
                  </div>
                  
                  <div className="cart__calc-row cart__calc-row--total">
                    <span>Итого:</span>
                    <span>{total.toLocaleString()} ₽</span>
                  </div>
                </div>

                {/* Информация о доставке */}
                {deliveryFee > 0 && (
                  <div className="cart__delivery-info">
                    💡 Добавьте товаров на {(5000 - subtotal).toLocaleString()} ₽ для бесплатной доставки
                  </div>
                )}

                {/* Кнопка оформления */}
                <button className="btn btn--primary cart__checkout-btn">
                  Перейти к оформлению
                </button>

                {/* Способы оплаты */}
                <div className="cart__payment-methods">
                  <span>Принимаем к оплате:</span>
                  <div className="cart__payment-icons">
                    <span>💳</span>
                    <span>🏦</span>
                    <span>📱</span>
                  </div>
                </div>
              </div>

              {/* Рекомендации */}
              <div className="cart__recommendations">
                <h4>Вам может понравиться</h4>
                <div className="cart__recommended-items">
                  <div className="cart__recommended-item">
                    <div className="cart__recommended-image">👕</div>
                    <div className="cart__recommended-info">
                      <h5>PewDiePie Wave Check</h5>
                      <span>2490 ₽</span>
                    </div>
                  </div>
                  <div className="cart__recommended-item">
                    <div className="cart__recommended-image">👕</div>
                    <div className="cart__recommended-info">
                      <h5>MrBeast Logo</h5>
                      <span>2990 ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;