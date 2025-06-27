// StripeCheckout.jsx
// A button to trigger Stripe Checkout using a backend session endpoint
import React from 'react';
import axios from '../axios';

const StripeCheckout = ({ amount, cartItems }) => {
  const handleCheckout = async () => {
    try {
      // Save cartItems to localStorage for use after redirect
      localStorage.setItem("stripeCartItems", JSON.stringify(cartItems));
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-stripe-session`,
        {
          amount,
          cartItems,
        }
      );
      const data = response.data;
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create Stripe session');
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <button onClick={handleCheckout} style={{background:'#635bff',color:'#fff',padding:'10px 20px',border:'none',borderRadius:'5px',fontWeight:'bold',cursor:'pointer',marginTop:'1rem'}}>
      Pay with Stripe
    </button>
  );
};

export default StripeCheckout;
