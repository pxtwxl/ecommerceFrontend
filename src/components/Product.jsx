import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";
const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`
        );
        const prod = response.data;
        // Use the same image loading approach as in Home.jsx and MyProducts.jsx
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/product/${prod.id}/image`
          );
          if (res.data && res.data.trim() !== "" && res.data !== "null") {
            const imageUrl = `data:${prod.imageType || "image/jpeg"};base64,${res.data}`;
            setProduct({ ...prod, imageUrl });
          } else {
            throw new Error("Invalid image data");
          }
        } catch (error) {
          try {
            const imgNameRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/product/${prod.id}/imagename`
            );
            const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${imgNameRes.data}`;
            setProduct({ ...prod, imageUrl });
          } catch (blobError) {
            setProduct({ ...prod, imageUrl: "/placeholder.jpg" });
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };
  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }
  return (
    <>
      <div className="containers">
        <img
          className="left-column-img"
          src={product.imageUrl}
          alt={product.imageName}
        />

        <div className="right-column">
          <div className="product-description">
            <div style={{display:'flex',justifyContent:'space-between' }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>
              {product.category}
            </span>
            <p className="release-date" style={{ marginBottom: "2rem" }}>
              <h6>Listed : <span> <i> {new Date(product.releaseDate).toLocaleDateString()}</i></span></h6>
            </p>
            </div>
            <h1>{product.name}</h1>
            <i>{product.brand}</i>
            <p style={{fontWeight:'bold',fontSize:'1rem',margin:'10px 0px 0px'}}>PRODUCT DESCRIPTION :</p>
            <p>{product.description}</p>
          </div>

          <div className="product-price">
            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
              ₹ {product.price}
            </span>
            <button
              className={`cart-btn${!product.productAvailable ? " disabled-btn" : ""}`}
              onClick={handlAddToCart}
              disabled={!product.productAvailable}
            >
              {product.productAvailable ? "Add to cart" : "Out of Stock"}
            </button>
            <h6>
              Stock Available : <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
            </h6>
          </div>
          <div className="update-button">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleEditClick}
            >
              Update
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={deleteProduct}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;