import React, { useState } from "react";
import "./Register.scss";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "customer",
    full_name: "",
    channel_name: "",
  });

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success / error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Регистрация успешна!");
        setStatus("success");
      } else {
        setMessage("❌ Ошибка: " + data.error);
        setStatus("error");
      }
    } catch (error) {
      setMessage("❌ Сервер недоступен.");
      setStatus("error");
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Логин"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Почта"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="full_name"
          placeholder="Полное имя"
          value={formData.full_name}
          onChange={handleChange}
        />

        <select name="user_type" value={formData.user_type} onChange={handleChange}>
          <option value="customer">Покупатель</option>
          <option value="youtuber">Ютубер</option>
        </select>

        {formData.user_type === "youtuber" && (
          <input
            type="text"
            name="channel_name"
            placeholder="Название канала"
            value={formData.channel_name}
            onChange={handleChange}
          />
        )}

        <button type="submit">Зарегистрироваться</button>
      </form>

      {message && <p className={`message ${status}`}>{message}</p>}
    </div>
  );
};

export default Register;
