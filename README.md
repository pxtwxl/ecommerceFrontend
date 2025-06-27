# SmartCart Frontend

SmartCart Frontend is a modern, responsive e-commerce web application built with React and Vite. It provides users with a seamless shopping experience, including product browsing, cart management, product comparison, order history, and secure payments via Stripe. The frontend is designed to work with the SmartCart Spring Boot backend API.

**Live Demo:**  
[https://ecommerce-ytty.onrender.com](https://ecommerce-ytty.onrender.com)

## Features
- User registration and authentication
- Browse products by category
- Product search and comparison
- Add, update, and remove items from the shopping cart
- View order history and user profile
- Stripe payment integration for secure checkout
- Responsive design using Bootstrap

## Tech Stack
- React 18
- Vite
- React Router v6
- Bootstrap 5 & Bootstrap Icons
- Stripe (for payments)
- Axios (for API requests)

## Backend API
This frontend communicates with a Spring Boot backend deployed at render.

Set this URL in your `.env.local` as:
```
VITE_BACKEND_URL
```

## Getting Started
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local` (see `.env.example`).
4. Run locally:
   ```bash
   npm run dev
   ```

## Deployment
- Build the app with `npm run build`.
- Deploy the contents of the `dist` folder to your preferred static hosting or as a Render Web Service using `npx serve -s dist`.

## Backend Repository
The backend for this project is available at:
[https://github.com/pxtwxl/ecommerceBackend](https://github.com/pxtwxl/ecommerceBackend)

---
