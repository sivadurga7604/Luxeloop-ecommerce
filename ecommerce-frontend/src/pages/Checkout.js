import React, { useEffect, useState } from "react";
import { API } from "../config";

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [paying, setPaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [shippingDetails, setShippingDetails] = useState({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        phone: ""
    });

    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        fetch(`${API}/cart/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCartItems(data);
                else if (data.items) setCartItems(data.items);
                else setCartItems([]);
                setLoading(false);
            })
            .catch(() => {
                setCartItems([]);
                setLoading(false);
            });
    }, [userId]);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleInputChange = (field, val) => {
        setShippingDetails({ ...shippingDetails, [field]: val });
    };

    const placeOrder = (e) => {
        if (e) e.preventDefault();
        if (cartItems.length === 0) { 
            alert("Your cart is empty!"); 
            return; 
        }
        if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode || !shippingDetails.phone) {
            alert("Please fill in all shipping details!");
            return;
        }

        setPaying(true);

        fetch(`${API}/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId, 
                totalAmount: total,
                paymentId: "MOCK-" + Date.now(), 
                status: "SUCCESS"
            })
        })
            .then(res => { 
                if (!res.ok) throw new Error("Order failed"); 
                return res.json(); 
            })
            .then(() => fetch(`${API}/cart/clear/${userId}`, { method: "DELETE" }))
            .then(() => { 
                setPaying(false); 
                window.location.href = "/success"; 
            })
            .catch(err => { 
                setPaying(false); 
                alert("Error placing order: " + err.message); 
            });
    };

    if (!userId) {
        return (
            <div style={{ padding: "40px 5%", maxWidth: "800px", margin: "0 auto", textAlign: "center" }} className="fade-in">
                <h1 style={{ marginBottom: "16px" }}>Checkout</h1>
                <div style={{ padding: "40px", background: "white", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Please login to proceed to checkout.</p>
                    <a href="/login" style={{
                        display: "inline-block", padding: "12px 30px", background: "var(--primary)", color: "white",
                        borderRadius: "8px", fontWeight: "600"
                    }}>Login Here</a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px 5%", maxWidth: "1200px", margin: "0 auto" }} className="fade-in">
            <h1 style={{ fontSize: "30px", color: "var(--primary-dark)", marginBottom: "25px" }}>Secure Checkout</h1>

            {loading ? (
                <p style={{ color: "var(--text-secondary)" }}>Reviewing cart items...</p>
            ) : cartItems.length === 0 ? (
                <div style={{
                    padding: "60px 20px", background: "#fff", borderRadius: "16px",
                    border: "1px dashed var(--border-color)", textAlign: "center"
                }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "20px" }}>You have no items to checkout.</p>
                    <a href="/" style={{
                        display: "inline-block", padding: "12px 30px", background: "var(--primary)", color: "white",
                        borderRadius: "8px", fontWeight: "600"
                    }}>Shop Products</a>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "40px", alignItems: "start" }}>
                    
                    {/* Shipping Form */}
                    <div style={{
                        background: "white",
                        border: "1px solid var(--border-color)",
                        borderRadius: "16px",
                        padding: "32px",
                        boxShadow: "var(--shadow-sm)"
                    }}>
                        <h2 style={{ fontSize: "20px", color: "var(--primary-dark)", marginBottom: "20px", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "12px" }}>
                            Shipping Details
                        </h2>

                        <form onSubmit={placeOrder}>
                            <div style={{ marginBottom: "18px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Full Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your full name" 
                                    style={{ width: "100%" }}
                                    value={shippingDetails.fullName}
                                    onChange={e => handleInputChange("fullName", e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Street Address</label>
                                <input 
                                    type="text" 
                                    placeholder="Apartment, suite, unit, house number, and street name" 
                                    style={{ width: "100%" }}
                                    value={shippingDetails.address}
                                    onChange={e => handleInputChange("address", e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "18px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>City / District</label>
                                    <input 
                                        type="text" 
                                        placeholder="City name" 
                                        style={{ width: "100%" }}
                                        value={shippingDetails.city}
                                        onChange={e => handleInputChange("city", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>PIN / Postal Code</label>
                                    <input 
                                        type="text" 
                                        placeholder="Postal code" 
                                        style={{ width: "100%" }}
                                        value={shippingDetails.postalCode}
                                        onChange={e => handleInputChange("postalCode", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: "25px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Mobile Number</label>
                                <input 
                                    type="tel" 
                                    placeholder="10-digit number" 
                                    style={{ width: "100%" }}
                                    value={shippingDetails.phone}
                                    onChange={e => handleInputChange("phone", e.target.value)}
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={paying}
                                style={{
                                    width: "100%",
                                    padding: "15px",
                                    background: paying ? "#aaa" : "var(--primary)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: paying ? "default" : "pointer",
                                    boxShadow: "0 4px 12px rgba(128,0,50,0.2)"
                                }}
                                onMouseEnter={(e) => { if (!paying) e.target.style.background = "var(--primary-light)"; }}
                                onMouseLeave={(e) => { if (!paying) e.target.style.background = "var(--primary)"; }}
                            >
                                {paying ? "Processing payment..." : `Place Order (₹${total.toLocaleString("en-IN")})`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Side Panel */}
                    <div style={{
                        background: "white",
                        border: "1px solid var(--border-color)",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "var(--shadow-md)"
                    }}>
                        <h2 style={{ fontSize: "20px", color: "var(--primary-dark)", marginBottom: "20px", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "12px" }}>
                            Items in Bag
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{
                                    display: "flex", 
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontSize: "14px",
                                    borderBottom: "1px solid #faf5f7",
                                    paddingBottom: "8px"
                                }}>
                                    <div style={{ flex: 1, paddingRight: "10px" }}>
                                        <span style={{ fontWeight: "600", color: "var(--primary-dark)" }}>{item.productName}</span>
                                        <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                                            ₹{item.price.toLocaleString("en-IN")} x {item.quantity}
                                        </div>
                                    </div>
                                    <strong style={{ color: "var(--primary-light)" }}>
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14.5px", color: "var(--text-secondary)" }}>
                            <span>Subtotal</span>
                            <span>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px", fontSize: "14.5px", color: "var(--text-secondary)" }}>
                            <span>Shipping</span>
                            <span style={{ color: "#2e7d32", fontWeight: "600" }}>FREE</span>
                        </div>

                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            borderTop: "1.5px solid var(--border-color)", 
                            paddingTop: "16px"
                        }}>
                            <span style={{ fontWeight: "700", fontSize: "16px" }}>Total Amount</span>
                            <span style={{ fontWeight: "800", fontSize: "20px", color: "var(--primary-dark)" }}>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Checkout;