import React, { useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";

const StripeSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useContext(AppContext);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    // Retrieve order/cart info from localStorage or query params
    const cartItems = JSON.parse(localStorage.getItem("stripeCartItems") || "[]");
    const userId = localStorage.getItem("userId");
    if (cartItems.length && userId) {
      const orderPayload = {
        buyerId: userId,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      axios.post("orders/checkout", orderPayload)
        .then(() => {
          localStorage.removeItem("stripeCartItems");
          clearCart();
          navigate("/myorders");
        })
        .catch(() => {
          alert("Order creation failed after payment.");
          navigate("/cart");
        });
    } else {
      navigate("/cart");
    }
  }, [navigate, location, clearCart]);

  return (
    <div style={{padding:40, textAlign:'center'}}>
      <h2>Payment Successful!</h2>
      <p>Placing your order...</p>
    </div>
  );
};

export default StripeSuccess;
