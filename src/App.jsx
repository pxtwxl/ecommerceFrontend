import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from "./Context/Context";
import MyProducts from "./components/MyProducts";
import MyOrders from "./components/MyOrders";
import Comparator from "./components/Comparator";
import CategoryPage from "./components/CategoryPage";
import StripeSuccess from "./components/StripeSuccess";

function AppRoutes() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const location = useLocation();
  const { isAuthenticated } = useContext(AppContext);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  useEffect(() => {
    if (location.pathname === "/register" || location.pathname === "/login") {
      document.body.classList.add("auth-page");
    } else {
      document.body.classList.remove("auth-page");
    }
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--body_background)', paddingTop: 50 }}>
      {location.pathname !== "/register" && location.pathname !== "/login" && (
        <Navbar onSelectCategory={handleCategorySelect} />
      )}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home addToCart={addToCart} selectedCategory={selectedCategory} /> : <Navigate to="/login" replace />} />
        <Route path="/add_product" element={<AddProduct />} />
        <Route path="/product" element={<Product />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/update/:id" element={<UpdateProduct />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myproducts" element={<MyProducts />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/comparator" element={<Comparator />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/success" element={<StripeSuccess />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
