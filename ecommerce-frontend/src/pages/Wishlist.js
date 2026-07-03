import React, { useEffect, useState } from "react";
import { API, getImageUrl } from "../config";

function Wishlist() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        loadWishlist();
    }, [userId]);

    const loadWishlist = () => {
        fetch(`${API}/wishlist/${userId}`)
            .then(res => res.json())
            .then(data => {
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setItems([]);
                setLoading(false);
            });
    };

    const remove = (productId) => {
        // Optimistically update state
        const originalItems = [...items];
        setItems(items.filter(item => item.productId !== productId));

        fetch(`${API}/wishlist/${userId}/${productId}`, { method: "DELETE" })
            .catch((err) => {
                console.error("Failed to delete wishlist item", err);
                setItems(originalItems);
            });
    };

    const moveToCart = (item) => {
        fetch(`${API}/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: Number(userId),
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: 1
            })
        }).then((res) => {
            if (res.ok) {
                remove(item.productId);
                alert(`${item.productName} moved to cart!`);
            } else {
                alert("Failed to move item to cart.");
            }
        });
    };

    if (!userId) {
        return (
            <div style={{ padding: "40px 5%", maxWidth: "800px", margin: "0 auto", textAlign: "center" }} className="fade-in">
                <h1 style={{ marginBottom: "16px" }}>My Wishlist</h1>
                <div style={{ padding: "40px", background: "white", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Please login to view your boutique wishlist.</p>
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
            <h1 style={{ fontSize: "30px", color: "var(--primary-dark)", marginBottom: "25px" }}>❤️ My Wishlist</h1>

            {loading ? (
                <p style={{ color: "var(--text-secondary)" }}>Loading your wishlist items...</p>
            ) : items.length === 0 ? (
                <div style={{
                    padding: "60px 20px", background: "#fff", borderRadius: "16px",
                    border: "1px dashed var(--border-color)", textAlign: "center"
                }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "20px" }}>Your wishlist is empty.</p>
                    <a href="/" style={{
                        display: "inline-block", padding: "12px 30px", background: "var(--primary)", color: "white",
                        borderRadius: "8px", fontWeight: "600"
                    }}>Explore Boutique Products</a>
                </div>
            ) : (
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                    gap: "30px" 
                }}>
                    {items.map(item => (
                        <div 
                            key={item.id} 
                            style={{
                                background: "#ffffff", 
                                borderRadius: "16px", 
                                padding: "20px",
                                boxShadow: "var(--shadow-sm)",
                                border: "1px solid var(--border-color)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                transition: "all 0.3s ease",
                                position: "relative"
                            }}
                            onMouseEnter={(e) => { 
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            }}
                            onMouseLeave={(e) => { 
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                            }}
                        >
                            {/* Product image container */}
                            <div style={{ 
                                background: "#fff", 
                                height: "200px", 
                                borderRadius: "10px", 
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "20px"
                            }}>
                                <img 
                                    src={getImageUrl(item.imageUrl)} 
                                    alt={item.productName} 
                                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                    onError={e => { e.target.src = "https://placehold.co/150x150?text=No+Image"; }} 
                                />
                            </div>

                            {/* Item Info */}
                            <div>
                                <h3 style={{ 
                                    fontSize: "16px", 
                                    color: "var(--primary-dark)", 
                                    marginBottom: "6px",
                                    lineHeight: "1.3" 
                                }}>{item.productName}</h3>
                                <p style={{ 
                                    fontWeight: "700", 
                                    color: "var(--primary-light)", 
                                    fontSize: "16px",
                                    marginBottom: "20px" 
                                }}>₹{item.price.toLocaleString("en-IN")}</p>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button 
                                    onClick={() => moveToCart(item)} 
                                    style={{
                                        flex: 2,
                                        background: "var(--primary)", 
                                        color: "white", 
                                        border: "none",
                                        padding: "10px 12px", 
                                        borderRadius: "8px", 
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "13.5px"
                                    }}
                                    onMouseEnter={(e) => { e.target.style.background = "var(--primary-light)"; }}
                                    onMouseLeave={(e) => { e.target.style.background = "var(--primary)"; }}
                                >
                                    Move to Cart
                                </button>
                                <button 
                                    onClick={() => remove(item.productId)} 
                                    style={{
                                        flex: 1,
                                        background: "transparent", 
                                        color: "#e53935", 
                                        border: "1.5px solid #ffcdd2",
                                        padding: "10px 12px", 
                                        borderRadius: "8px", 
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "13.5px"
                                    }}
                                    onMouseEnter={(e) => { e.target.style.background = "#ffebee"; }}
                                    onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;