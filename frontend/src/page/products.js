import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import ProductCard from "../components/ProductCard/ProductCard";
import "./products.scss";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SECRET_KEY = "12345678901234567890123456789012";
  const IV = "1234567890123456";

  const decrypt = (encrypted) => {
    try {
      const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
      const iv = CryptoJS.enc.Utf8.parse(IV);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(encrypted),
      });

      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Ошибка дешифрования:", e);
      return encrypted;
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        const encryptedData = res.data.encrypted;
        const decryptedJson = decrypt(encryptedData);
        const data = JSON.parse(decryptedJson).products || [];
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить товары");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка товаров...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="products-page">
      <div className="products-page__container">
        <h2>Каталог товаров</h2>
        <div className="products-page__grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={`${product.price} ₸`}
              img={product.image_url}
              alt={product.name}
              link={`/product/${product.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
