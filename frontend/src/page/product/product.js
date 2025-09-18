import "./product.scss";

const Product = ({ product }) => {
  if (!product) {
    return <div className="product-page">Товар не найден</div>;
  }

  return (
    <section className="product-page">
      <div className="product-page__container">
        <h2 className="product-page__title">{product.name}</h2>
        <div className="product-page__content">
          <img src={product.img} alt={product.name} className="product-page__image" />
          <div className="product-page__details">
            <p className="product-page__price">Цена: {product.price}</p>
            <button className="product-page__buy-button">Купить</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Product;