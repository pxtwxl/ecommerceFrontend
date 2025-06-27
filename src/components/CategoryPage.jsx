import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link, useParams } from "react-router-dom";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/api/products/category/${encodeURIComponent(category)}`);
        const productsWithImages = await Promise.all(
          res.data.map(async (product) => {
            try {
              const imgRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/${product.id}/image`
              );
              if (imgRes.data && imgRes.data.trim() !== "" && imgRes.data !== "null") {
                const imageUrl = `data:${product.imageType || "image/jpeg"};base64,${imgRes.data}`;
                return { ...product, imageUrl };
              } else {
                throw new Error("Invalid image data");
              }
            } catch (error) {
              try {
                const response = await axios.get(
                  `${import.meta.env.VITE_BACKEND_URL}/api/product/${product.id}/imagename`
                );
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${response.data}`;
                return { ...product, imageUrl };
              } catch (blobError) {
                return { ...product, imageUrl: "/placeholder.jpg" };
              }
            }
          })
        );
        setProducts(productsWithImages);
      } catch (err) {
        setError("Failed to fetch products for this category.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <div className="no-products-center"><h2>Loading...</h2></div>;
  if (error) return <div className="no-products-center"><h2>{error}</h2></div>;
  if (products.length === 0) return <div className="no-products-center"><h2>No Products Found in {category}</h2></div>;

  return (
    <div className="home-product-grid">
      {products.map(product => (
        <div className="home-product-card" key={product.id}>
          <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <img src={product.imageUrl || "/placeholder.jpg"} alt={product.name} />
            <div className="card-body">
              <div>
                <h5 className="card-title">{product.name.toUpperCase()}</h5>
                <i className="card-brand">~ {product.brand}</i>
              </div>
              <hr className="hr-line" />
              <div className="home-cart-price">
                <h5 className="card-text">
                  <i className="bi bi-currency-rupee"></i>
                  {product.price}
                </h5>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
