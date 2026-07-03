import React, { useEffect, useState } from "react";
import { API, getImageUrl } from "../config";

function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        loadCart();
    }, [userId]);

    const loadCart = () => {
        fetch(`${API}/cart/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCart(data);
                else if (data.items) setCart(data.items);
                else setCart([]);
                setLoading(false);
            })
            .catch(() => {
                setCart([]);
                setLoading(false);
            });
    };

    const remove = (id) => {
        // Optimistically update state
        const originalCart = [...cart];
        setCart(cart.filter(item => item.id !== id));

        fetch(`${API}/cart/${id}`, { method: "DELETE" })
            .catch((err) => {
                console.error("Failed to delete cart item", err);
                setCart(originalCart); // Rollback on failure
            });
    };

    const updateQuantity = (item, newQty) => {
        if (newQty < 1) return;
        
        // Optimistically update state
        const originalCart = [...cart];
        setCart(cart.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));

        fetch(`${API}/cart/${item.id}?quantity=${newQty}`, {
            method: "PUT"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update");
                return res.json();
            })
            .catch((err) => {
                console.error(err);
                setCart(originalCart); // Rollback on failure
            });
    };

    if (!userId) {
        return (
            <div style={{ padding: "40px 5%", maxWidth: "800px", margin: "0 auto", textAlign: "center" }} className="fade-in">
                <h1 style={{ marginBottom: "16px" }}>Boutique Cart</h1>
                <div style={{ padding: "40px", background: "white", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Please login to view your shopping cart.</p>
                    <a href="/login" style={{
                        display: "inline-block", padding: "12px 30px", background: "var(--primary)", color: "white",
                        borderRadius: "8px", fontWeight: "600"
                    }}>Login Here</a>
                </div>
            </div>
        );
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div style={{ padding: "40px 5%", maxWidth: "1200px", margin: "0 auto" }} className="fade-in">
            <h1 style={{ fontSize: "30px", color: "var(--primary-dark)", marginBottom: "25px" }}>Your Shopping Cart</h1>

            {loading ? (
                <p style={{ color: "var(--text-secondary)" }}>Reviewing your bag...</p>
            ) : cart.length === 0 ? (
                <div style={{
                    padding: "60px 20px", background: "#fff", borderRadius: "16px",
                    border: "1px dashed var(--border-color)", textAlign: "center"
                }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "20px" }}>Your cart is empty.</p>
                    <a href="/" style={{
                        display: "inline-block", padding: "12px 30px", background: "var(--primary)", color: "white",
                        borderRadius: "8px", fontWeight: "600"
                    }}>Continue Shopping</a>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", alignItems: "start" }}>
                    
                    {/* Cart Items list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {cart.map(i => (
                            <div key={i.id} style={{
                                display: "flex", 
                                alignItems: "center", 
                                gap: "20px",
                                background: "#fff", 
                                padding: "20px", 
                                borderRadius: "16px", 
                                border: "1px solid var(--border-color)",
                                boxShadow: "var(--shadow-sm)"
                            }}>
                                <div style={{
                                    width: "90px",
                                    height: "90px",
                                    background: "#fafafa",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden"
                                }}>
                                    <img 
                                        src={getImageUrl(i.imageUrl)} 
                                        width="80" 
                                        alt={i.productName}
                                        style={{ objectFit: "contain", maxHeight: "100%" }}
                                        onError={e => { e.target.src = "https://placehold.co/150x150?text=No+Image"; }} 
                                    />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: "16px", color: "var(--primary-dark)", marginBottom: "4px" }}>{i.productName}</h3>
                                    <p style={{ fontWeight: "700", color: "var(--primary-light)", fontSize: "15.5px" }}>₹{i.price.toLocaleString("en-IN")}</p>
                                    
                                    {/* Quantity Controls */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
                                        <button 
                                            onClick={() => updateQuantity(i, i.quantity - 1)}
                                            style={{
                                                background: "#f3e8ec", border: "none", width: "28px", height: "28px",
                                                borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center",
                                                justifyContent: "center", fontSize: "16px", fontWeight: "bold", color: "var(--primary)"
                                            }}
                                        >-</button>
                                        <span style={{ fontSize: "14.5px", fontWeight: "600", width: "24px", textAlign: "center" }}>{i.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(i, i.quantity + 1)}
                                            style={{
                                                background: "#f3e8ec", border: "none", width: "28px", height: "28px",
                                                borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center",
                                                justifyContent: "center", fontSize: "16px", fontWeight: "bold", color: "var(--primary)"
                                            }}
                                        >+</button>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "15px" }}>
                                    <strong style={{ fontSize: "16.5px", color: "var(--primary-dark)" }}>
                                        ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                                    </strong>
                                    <button 
                                        onClick={() => remove(i.id)} 
                                        style={{
                                            background: "transparent", 
                                            color: "#e53935",
                                            border: "none", 
                                            cursor: "pointer",
                                            fontSize: "13.5px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary Panel */}
                    <div style={{
                        background: "white",
                        border: "1px solid var(--border-color)",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "var(--shadow-md)"
                    }}>
                        <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "12px" }}>Order Summary</h2>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "14.5px", color: "var(--text-secondary)" }}>
                            <span>Subtotal</span>
                            <span>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "14.5px", color: "var(--text-secondary)" }}>
                            <span>Shipping</span>
                            <span style={{ color: "#2e7d32", fontWeight: "600" }}>FREE</span>
                        </div>
                        
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            borderTop: "1.5px solid var(--border-color)", 
                            paddingTop: "16px",
                            marginBottom: "24px"
                        }}>
                            <span style={{ fontWeight: "700", fontSize: "16.5px" }}>Total Amount</span>
                            <span style={{ fontWeight: "800", fontSize: "20px", color: "var(--primary-dark)" }}>₹{total.toLocaleString("en-IN")}</span>
                        </div>

                        <a 
                            href="/checkout"
                            style={{
                                display: "block",
                                textAlign: "center",
                                width: "100%",
                                padding: "14px",
                                background: "var(--primary)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(128,0,50,0.2)"
                            }}
                            onMouseEnter={(e) => { e.target.style.background = "var(--primary-light)"; }}
                            onMouseLeave={(e) => { e.target.style.background = "var(--primary)"; }}
                        >
                            Proceed to Checkout
                        </a>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Cart;