import React, { useEffect, useState, useContext } from "react";
import axios from "../axios";
import AppContext from "../Context/Context";

const MyOrders = () => {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "BUYER") {
      setLoading(false);
      return;
    }
    const userId = localStorage.getItem("userId");
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/orders/buyer/${userId}`);
        setOrders(res.data);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user || user.role !== "BUYER") {
    return <div style={{ padding: 40, textAlign: "center", color: "#fff", background: "#222" }}>Unauthorized</div>;
  }
  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#fff", background: "#222" }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center", color: "red", background: "#222" }}>{error}</div>;

  return (
    <div className="home-product-grid">
      {orders.length === 0 ? (
        <div className="no-products-center">
          <h2 className="text-center">No Orders Found</h2>
        </div>
      ) : (
        orders.map((order) => (
          <div
            className="home-product-card"
            key={order.id}
            style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, boxShadow: '0 2px 8px rgba(80,0,120,0.08)', minWidth: 320, maxWidth: 350 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h5 style={{ margin: 0 }}>Order #{order.id}</h5>
              <span className="order-status-badge" style={{
                padding: '4px 12px',
                borderRadius: 16,
                background: order.status === 'COMPLETED' ? '#d1ffd6' : order.status === 'CANCELLED' ? '#ffd6d6' : '#ffe9b3',
                fontWeight: 600,
                fontSize: 13
              }}>{order.status}</span>
            </div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
              <span><b>Date:</b> {new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div className="order-total-text">
              Total: <span className="order-total-amount">₹{order.totalAmount}</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <b>Items:</b>
              <table style={{ width: '100%', marginTop: 6, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3eaff', color: '#8f5cff', fontSize: 14 }}>
                    <th style={{ padding: 6, borderRadius: 4, textAlign: 'left' }}>Product</th>
                    <th style={{ padding: 6, borderRadius: 4 }}>Qty</th>
                    <th style={{ padding: 6, borderRadius: 4 }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.map(item => (
                    <tr key={item.productId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 6 }}>{item.productName}</td>
                      <td style={{ padding: 6, textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: 6, textAlign: 'center' }}>₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
