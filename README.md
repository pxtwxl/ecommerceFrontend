# SmartCart Frontend

This is the frontend for the SmartCart e-commerce platform, built with React and Vite. It provides a modern, responsive user interface for browsing products, managing a shopping cart, comparing items, and completing secure purchases via Stripe.

**Live Demo:**  
[https://ecommerce-ytty.onrender.com](https://ecommerce-ytty.onrender.com)

## Features
- User authentication and registration
- Product browsing by category
- Product search and comparison
- Shopping cart management
- Order history and user profile
- Stripe payment integration
- Responsive design with Bootstrap

## Tech Stack
- React
- Vite
- React Router
- Bootstrap 5
- Stripe (for payments)
- Axios (for API requests)

## Backend API
The frontend communicates with a Spring Boot backend deployed at:

```
https://ecommercebackend-we06.onrender.com
```

This URL is set in the frontend via the environment variable:

```
VITE_BACKEND_URL=https://ecommercebackend-we06.onrender.com
```

All API requests from the frontend are made to this backend URL.

## Backend Repository
The backend for this project is a Spring Boot REST API that handles authentication, product management, orders, payments (Stripe), and user data. It is designed to work seamlessly with this frontend.

**GitHub Repository:**  
[https://github.com/pxtwxl/ecommerceBackend](https://github.com/pxtwxl/ecommerceBackend)

### Key Features
- User authentication and authorization (JWT)
- Product CRUD operations
- Category and search endpoints
- Order management
- Stripe payment integration
- Secure environment variable management
- PostgreSQL database support

You can find setup instructions, API documentation, and deployment details in the backend repository’s README.

## Getting Started
1. Clone the repository.
2. Install dependencies:  
   `npm install`
3. Set up environment variables in `.env.local` (see `.env.example`).
4. Run locally:  
   `npm run dev`

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
