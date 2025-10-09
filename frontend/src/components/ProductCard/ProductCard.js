// src/components/ProductCard/ProductCard.js
import { Link } from "react-router-dom";
import "./ProductCard.scss";

const ProductCard = ({ img, alt, name, price, link }) => {
  return (
    <div className="product-card">
      <img src={img} alt={alt} className="product-card__image" />
      <h3 className="product-card__name">{name}</h3>
      <p className="product-card__price">{price}</p>
      <Link to={link} className="product-card__button">
        Подробнее
      </Link>
    </div>
  );
};

export default ProductCard;
