import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import CreatorSpotlight from './components/CreatorSpotlight/CreatorSpotlight';
import Footer from './components/Footer/Footer';
import Products from './page/products';
import './App.scss';
import Cart from './page/Cart/Cart';
import CreatorProfile from './page/CreatorProfile/CreatorProfile';
import CreatorsPage from './page/CreatorsPage/CreatorsPage';
import About from './page/About/About';
import Product from './page/product/product';
import Register from './page/Register/Register';
import Login from './page/Login/Login';
import CustomerProfile from './page/CustomerProfile/CustomerProfile';
import YoutuberProfile from './page/YoutuberProfile/YoutuberProfile';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Шапка сайта */}
        <Header />
        
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={
            <main className="main-content">
              {/* блок с баннером */}
              <Hero />
              
              {/* Блок с популярными ютуберами-продавцами */}
              <CreatorSpotlight products />
            </main>
          } />
          
          
          {/* другие стр */}
          <Route path="/login" element={<Login />} />
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/youtuber-profile" element={<YoutuberProfile />} />
          <Route path="/products" element={<Products />}/>
          <Route path="/cart" element={<Cart/>} />
          <Route path="/creator/:id" element={<CreatorProfile />}/>
          <Route path="/CreatorsPage" element={<CreatorsPage/>}/>
          <Route path="/product/:id" element={<Product/>} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          {/* т          */}  
        </Routes>
        
        {/* Подвал сайта */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;