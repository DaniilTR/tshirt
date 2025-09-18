// components/CreatorSpotlight/CreatorSpotlight.js - Компонент для отображения избранных продуктов
import { Link } from "react-router-dom";
import "./CreatorSpotlight.scss";

const iv1 = process.env.PUBLIC_URL + '/img/iv1.png';
const kypl = process.env.PUBLIC_URL + '/img/kypl.png';
const thebrain = process.env.PUBLIC_URL + '/img/thebrain.png';


const creators = [
  {
    id: 1,
    name: "IVAN",
    description: "Коллекция от популярного стримера Ivan.",
    image: iv1,
  },
  {
    id: 2,
    name: "KYPL",
    description: "Уникальный стиль от KYPL.",
    image: kypl,
  },
  {
    id: 3,
    name: "TheBrain",
    description: "Авторский мерч TheBrain.",
    image: thebrain,
  },
];

const CreatorSpotlight = () => {
  return (
    <section className="creator-spotlight">
      <div className="creator-spotlight__container">
        <h2 className="creator-spotlight__title">Наши Ютуберы</h2>

        <div className="creator-spotlight__grid">
          {creators.map((creator) => (
            <div key={creator.id} className="creator-spotlight__card">
              <img
                src={creator.image}
                alt={creator.name}
                className="creator-spotlight__image"
              />
              <h3 className="creator-spotlight__name">{creator.name}</h3>
              <p className="creator-spotlight__description">
                {creator.description}
              </p>
            </div>
          ))}
        </div>

        <Link to="/products" className="creator-spotlight__button">
          Смотреть все товары
        </Link>
      </div>
    </section>
  );
};

export default CreatorSpotlight;

