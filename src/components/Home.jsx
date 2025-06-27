import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            let imageUrl;
            try {
              const res = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`
              );
              if (res.data && res.data.trim() !== "" && res.data !== "null") {
                const imageUrl = `data:${product.imageType || "image/jpeg"};base64,${res.data}`;
                return { ...product, imageUrl };
              } else {
                throw new Error("Invalid image data");
              }
            } catch (error) {
              try {
                const response = await axios.get(
                  `http://localhost:8080/api/product/${product.id}/imagename`
                );
                const imageUrl = `http://localhost:8080${response.data}`;
                return { ...product, imageUrl };
              } catch (blobError) {
                return { ...product, imageUrl: "/placeholder.jpg" };
              }
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="home-error-center">
        <h2 className="text-center">
          <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }}/>
        </h2>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="no-products-center">
        <h2 className="text-center">No Products Available</h2>
      </div>
    );
  }

  return (
    <div className="home-product-grid">
      {filteredProducts.map((product) => {
        const { id, brand, name, price, productAvailable, imageUrl } =
          product;
        return (
          <div
            className="home-product-card"
            style={{ backgroundColor: productAvailable ? "#fff" : "#ccc" }}
            key={id}
          >
            <Link
              to={`/product/${id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={imageUrl}
                alt={name}
              />
              <div className="card-body">
                <div>
                  <h5 className="card-title">{name.toUpperCase()}</h5>
                  <i className="card-brand">{"~ " + brand}</i>
                </div>
                <hr className="hr-line" />
                <div className="home-cart-price">
                  <h5 className="card-text">
                    <i className="bi bi-currency-rupee"></i>
                    {price}
                  </h5>
                </div>
                <button
                  className="btn-hover color-9"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  disabled={!productAvailable}
                >
                  {productAvailable ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
