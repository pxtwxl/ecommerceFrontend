import React, { useEffect, useState, useContext } from "react";
import axios from "../axios";
import AppContext from "../Context/Context";
import { Link } from "react-router-dom";

const MyProducts = () => {
  const { user } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "SELLER") return;
    const userId = localStorage.getItem("userId");
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/products/seller/${userId}`);
        const productsWithImages = await Promise.all(
          res.data.map(async (product) => {
            try {
              const imgRes = await axios.get(
                `api/product/${product.id}/image`
              );
              if (imgRes.data && imgRes.data.trim() !== "" && imgRes.data !== "null") {
                const imageUrl = `data:${product.imageType || "image/jpeg"};base64,${imgRes.data}`;
                return { ...product, imageUrl };
              } else {
                throw new Error("Invalid image data");
              }
            } catch (error) {
              try {
                const imgNameRes = await axios.get(
                  `api/product/${product.id}/imagename`
                );
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${imgNameRes.data}`;
                return { ...product, imageUrl };
              } catch (blobError) {
                return { ...product, imageUrl: "/placeholder.jpg" };
              }
            }
          })
        );
        setProducts(productsWithImages);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  if (!user || user.role !== "SELLER") {
    return <div style={{ padding: 40, textAlign: "center" }}>Unauthorized</div>;
  }
  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center", color: "red" }}>{error}</div>;

  return (
    <div style={{ marginTop: 80 }}>
      <h2 style={{ textAlign: 'center' }}>My Products</h2>
      {products.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No products found.</p>
      ) : (
        <div className="home-product-grid">
          {products.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl, stockQuantity, category } = product;
            return (
              <Link
                to={`/product/${id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                key={id}
              >
                <div
                  className="home-product-card"
                  style={{ backgroundColor: productAvailable ? "#fff" : "#ccc" }}
                >
                  <img
                    src={imageUrl}
                    alt={name}
                  />
                  <div className="card-body">
                    <div>
                      <h5 className="card-title">{name && name.toUpperCase()}</h5>
                      <i className="card-brand">{brand ? `~ ${brand}` : ''}</i>
                    </div>
                    <hr className="hr-line" />
                    <div className="home-cart-price">
                      <h5 className="card-text">
                        <i className="bi bi-currency-rupee"></i>
                        {price}
                      </h5>
                    </div>
                    <div style={{ margin: '10px 0', fontSize: '0.95rem' }}>
                      <b>Stock:</b> {stockQuantity} <br />
                      <b>Category:</b> {category}
                    </div>
                    <button
                      className="btn-hover color-9"
                      disabled={!productAvailable}
                    >
                      {productAvailable ? "Available" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
