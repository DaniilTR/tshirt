// src/pages/About/About.js - Страница "О нас"
import "./About.scss";

const About = () => {
  return (
    <section className="about">
      <div className="about__container">
        <h2 className="about__title">О нас</h2>
        <p className="about__text">
          TubeShirts — это брендовый магазин, где вы найдете эксклюзивный мерч
          от популярных ютуберов. Мы создаём качественные футболки с уникальными
          дизайнами, чтобы каждый фанат мог почувствовать себя ближе к своим кумирам.
        </p>
        <p className="about__text">
          Все наши товары печатаются на премиальных тканях и проходят строгий
          контроль качества. Мы работаем напрямую с блогерами, чтобы вы получали
          только официальную продукцию.
        </p>
        <p className="about__text">
          TubeShirts — это стиль, удобство и поддержка ваших любимых авторов.
        </p>
      </div>
    </section>
  );
};

export default About;
