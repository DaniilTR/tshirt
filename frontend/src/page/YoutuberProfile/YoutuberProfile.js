import "./YoutuberProfile.scss";
import React, { useEffect, useState } from "react";

function YoutuberProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) return <p>Загрузка...</p>;

  return (
    <div className="youtuber-profile">
      <h2>Профиль Ютубера</h2>
      <p><b>Логин:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Канал:</b> {user.channel_name || "Не указано"}</p>
      <p><b>Подписчики:</b> {user.channel_subscribers || 0}</p>
      {user.avatar_url && <img src={user.avatar_url} alt="Аватар" width="100" />}

      <hr />
      <h3>Добавление товаров</h3>
      {/* Здесь подключаем форму для добавления продуктов */}
      {/* <AddProductForm /> */}
    </div>
  );
}

export default YoutuberProfile;
