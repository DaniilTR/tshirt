import "./CustomerProfile.scss";
import React, { useEffect, useState } from "react";
import Cart from "../../page/Cart/Cart";

function CustomerProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) return <p>Загрузка...</p>;

  return (
    <div >
        <div className="customer-profile">
      <h2>Профиль покупателя</h2>
      <p><b>Логин:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Имя:</b> {user.full_name || "Не указано"}</p>
      {user.avatar_url && <img src={user.avatar_url} alt="Аватар" width="100" />}

      <hr />

      <h3>Моя корзина</h3></div>
      <Cart /> 
    </div>
  );
}

export default CustomerProfile;
