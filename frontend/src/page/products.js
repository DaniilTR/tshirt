// src/pages/Products.js - Страница каталога товаров
import "./products.scss";
import ProductCard from "../components/ProductCard/ProductCard";

import thebrain from "../img/tshirt/thebrain.png";
import kypl from "../img/tshirt/kypl.png";
import iv1 from "../img/tshirt/iv1.png";
import mrbeast from "../img/tshirt/mrbeast.png";
import pewdiepie from "../img/tshirt/pewdiepie.png";
import dream from "../img/tshirt/dream.png";
import a4 from "../img/tshirt/a4.png";
import dantdm from "../img/tshirt/dantdm.png";
import ninja from "../img/tshirt/ninja.png";
import ksi from "../img/tshirt/ksi.png";

const Products = () => {
  // Список продуктов (20 товаров, 10 ютуберов)
  // Импорты картинок


// Массив товаров
const products = [
  { id: 1, name: "Футболка TheBrain Classic", price: "6 000 ₸", img: thebrain, link: "/products/thebrain-classic" },
  { id: 2, name: "Футболка TheBrain Limited", price: "7 500 ₸", img: thebrain, link: "/products/thebrain-limited" },

  { id: 3, name: "Футболка Kuplinov Play Retro", price: "6 500 ₸", img: kypl, link: "/products/kupl-retro" },
  { id: 4, name: "Футболка Kuplinov Play Pixel", price: "7 000 ₸", img: kypl, link: "/products/kupl-pixel" },

  { id: 5, name: "Футболка IvanGai Energy", price: "6 000 ₸", img: iv1, link: "/products/ivangai-energy" },
  { id: 6, name: "Футболка IvanGai Neon", price: "6 800 ₸", img: iv1, link: "/products/ivangai-neon" },

  { id: 7, name: "Футболка MrBeast Logo", price: "8 500 ₸", img: mrbeast, link: "/products/mrbeast-logo" },
  { id: 8, name: "Футболка MrBeast Challenge", price: "9 000 ₸", img: mrbeast, link: "/products/mrbeast-challenge" },

  { id: 9, name: "Футболка PewDiePie Brofist", price: "7 500 ₸", img: pewdiepie, link: "/products/pewdiepie-brofist" },
  { id: 10, name: "Футболка PewDiePie Meme", price: "7 800 ₸", img: pewdiepie, link: "/products/pewdiepie-meme" },

  { id: 11, name: "Футболка Dream Green", price: "6 200 ₸", img: dream, link: "/products/dream-green" },
  { id: 12, name: "Футболка Dream Smile", price: "6 700 ₸", img: dream, link: "/products/dream-smile" },

  { id: 13, name: "Футболка A4 Vlad Fun", price: "5 900 ₸", img: a4, link: "/products/a4-fun" },
  { id: 14, name: "Футболка A4 Vlad Squad", price: "6 300 ₸", img: a4, link: "/products/a4-squad" },

  { id: 15, name: "Футболка DanTDM Crystal", price: "7 000 ₸", img: dantdm, link: "/products/dantdm-crystal" },
  { id: 16, name: "Футболка DanTDM Diamond", price: "7 200 ₸", img: dantdm, link: "/products/dantdm-diamond" },

  { id: 17, name: "Футболка Ninja Blue", price: "8 000 ₸", img: ninja, link: "/products/ninja-blue" },
  { id: 18, name: "Футболка Ninja Red", price: "8 300 ₸", img: ninja, link: "/products/ninja-red" },

  { id: 19, name: "Футболка KSI Prime", price: "7 600 ₸", img: ksi, link: "/products/ksi-prime" },
  { id: 20, name: "Футболка KSI Boxing", price: "8 200 ₸", img: ksi, link: "/products/ksi-boxing" },
];


  return (
    <section className="products-page">
      <div className="products-page__container">
        <h2 className="products-page__title">Каталог товаров</h2>
        <div className="products-page__grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              img={product.img}
              link={product.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;