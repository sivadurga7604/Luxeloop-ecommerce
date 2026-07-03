import React, { useEffect, useState } from "react";
import { API, getImageUrl } from "../config";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [wishlistIds, setWishlistIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        setLoading(true);
        Promise.all([
            loadCategoriesPromise(),
            loadProductsPromise(null),
            loadWishlistPromise()
        ]).finally(() => setLoading(false));
    }, []);

    const loadCategoriesPromise = () => {
        return fetch(`${API}/categories`)
            .then(res => res.ok ? res.json() : [])
            .then(data => setCategories(data))
            .catch(() => setCategories([]));
    };

    const loadProductsPromise = (categoryId) => {
        const url = categoryId
            ? `${API}/products/category/${categoryId}`
            : `${API}/products`;
        return fetch(url)
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]));
    };

    const loadWishlistPromise = () => {
        if (!userId) return Promise.resolve();
        return fetch(`${API}/wishlist/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setWishlistIds(data.map(w => w.productId));
            })
            .catch(() => setWishlistIds([]));
    };

    const handleTabClick = (categoryId) => {
        setActiveCategory(categoryId);
        setSearchTerm("");
        setLoading(true);
        loadProductsPromise(categoryId).finally(() => setLoading(false));
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setActiveCategory(null);
        if (term.trim() === "") {
            setLoading(true);
            loadProductsPromise(null).finally(() => setLoading(false));
            return;
        }
        fetch(`${API}/products/search?name=${encodeURIComponent(term)}`)
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]));
    };

    const addToCart = (product) => {
        if (!userId) {
            alert("Please login first!");
            window.location.href = "/login";
            return;
        }
        fetch(`${API}/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: Number(userId),
                productId: product.id,
                productName: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1
            })
        }).then(res => {
            if (res.ok) {
                alert(`Added ${product.name} to cart!`);
            } else {
                alert("Failed to add product to cart.");
            }
        });
    };

    const toggleWishlist = (product) => {
        if (!userId) {
            alert("Please login first!");
            window.location.href = "/login";
            return;
        }
        const isWishlisted = wishlistIds.includes(product.id);
        if (isWishlisted) {
            setWishlistIds(wishlistIds.filter(id => id !== product.id));
            fetch(`${API}/wishlist/${userId}/${product.id}`, { method: "DELETE" });
        } else {
            setWishlistIds([...wishlistIds, product.id]);
            fetch(`${API}/wishlist/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: Number(userId),
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl
                })
            });
        }
    };

    return (
        <div style={{ padding: "40px 5%", maxWidth: "1400px", margin: "0 auto" }} className="fade-in">
            {/* Header & Search */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                flexWrap: "wrap", 
                gap: "20px",
                marginBottom: "35px"
            }}>
                <div>
                    <h1 style={{ fontSize: "32px", color: "var(--primary-dark)", marginBottom: "4px" }}>Boutique Collection</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>Discover high-end styles curated specifically for you</p>
                </div>
                
                <div style={{ position: "relative", width: "100%", maxWidth: "380px" }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => handleSearch(e.target.value)}
                        style={{
                            width: "100%", 
                            padding: "12px 16px 12px 42px", 
                            borderRadius: "30px",
                            border: "1.5px solid var(--border-color)", 
                            fontSize: "14.5px"
                        }}
                    />
                    <span style={{ 
                        position: "absolute", 
                        left: "16px", 
                        top: "50%", 
                        transform: "translateY(-50%)", 
                        color: "var(--text-secondary)",
                        fontSize: "16px"
                    }}>🔍</span>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "10px", 
                marginBottom: "40px",
                borderBottom: "1.5px solid var(--border-color)",
                paddingBottom: "20px"
            }}>
                <button 
                    onClick={() => handleTabClick(null)}
                    style={{
                        padding: "10px 24px",
                        borderRadius: "30px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        background: (activeCategory === null && searchTerm === "") ? "var(--primary)" : "#f3e8ec",
                        color: (activeCategory === null && searchTerm === "") ? "white" : "var(--primary)",
                        boxShadow: (activeCategory === null && searchTerm === "") ? "0 4px 12px rgba(128,0,50,0.15)" : "none"
                    }}
                >
                    All Collection
                </button>
                {categories.map(c => (
                    <button 
                        key={c.id} 
                        onClick={() => handleTabClick(c.id)}
                        style={{
                            padding: "10px 24px",
                            borderRadius: "30px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "14px",
                            background: activeCategory === c.id ? "var(--primary)" : "#f3e8ec",
                            color: activeCategory === c.id ? "white" : "var(--primary)",
                            boxShadow: activeCategory === c.id ? "0 4px 12px rgba(128,0,50,0.15)" : "none"
                        }}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>Curating collections...</p>
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div style={{ 
                            textAlign: "center", 
                            padding: "60px 20px", 
                            background: "#fff", 
                            borderRadius: "16px",
                            border: "1px dashed var(--border-color)"
                        }}>
                            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>No items found in this section.</p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                            gap: "30px" 
                        }}>
                            {products.map(p => {
                                const isWishlisted = wishlistIds.includes(p.id);
                                return (
                                    <div 
                                        key={p.id} 
                                        style={{
                                            background: "#ffffff", 
                                            borderRadius: "16px", 
                                            padding: "20px",
                                            boxShadow: "var(--shadow-sm)",
                                            border: "1px solid var(--border-color)",
                                            position: "relative",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            transition: "all 0.3s ease",
                                            overflow: "hidden"
                                        }}
                                        className="product-card"
                                        onMouseEnter={(e) => { 
                                            e.currentTarget.style.transform = "translateY(-6px)";
                                            e.currentTarget.style.boxShadow = "var(--shadow-md)";
                                        }}
                                        onMouseLeave={(e) => { 
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                                        }}
                                    >
                                        {/* Wishlist toggle heart */}
                                        <button 
                                            onClick={() => toggleWishlist(p)} 
                                            style={{
                                                position: "absolute", 
                                                top: "16px", 
                                                right: "16px",
                                                background: "rgba(255,255,255,0.9)",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "36px",
                                                height: "36px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                                cursor: "pointer",
                                                zIndex: 10,
                                                fontSize: "18px"
                                            }}
                                        >
                                            {isWishlisted ? "❤️" : "🤍"}
                                        </button>

                                        {/* Product image with container */}
                                        <div style={{ 
                                            background: "#fff", 
                                            height: "220px", 
                                            borderRadius: "10px", 
                                            overflow: "hidden",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: "20px"
                                        }}>
                                            <img
                                                src={getImageUrl(p.imageUrl)}
                                                alt={p.name}
                                                style={{ 
                                                    maxWidth: "100%", 
                                                    maxHeight: "100%", 
                                                    objectFit: "contain",
                                                    transition: "transform 0.5s ease"
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/150x150?text=No+Image";
                                                }}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <div>
                                                <h3 style={{ 
                                                    fontSize: "16.5px", 
                                                    color: "var(--primary-dark)", 
                                                    marginBottom: "6px",
                                                    lineHeight: "1.3" 
                                                }}>{p.name}</h3>
                                                <p style={{ 
                                                    fontWeight: "700", 
                                                    color: "var(--primary-light)", 
                                                    fontSize: "18px",
                                                    marginBottom: "16px" 
                                                }}>₹{p.price.toLocaleString("en-IN")}</p>
                                            </div>
                                            
                                            <button 
                                                onClick={() => addToCart(p)} 
                                                style={{
                                                    width: "100%",
                                                    background: "var(--primary)", 
                                                    color: "white", 
                                                    border: "none",
                                                    padding: "12px", 
                                                    borderRadius: "8px", 
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                    fontSize: "14px"
                                                }}
                                                onMouseEnter={(e) => { e.target.style.background = "var(--primary-light)"; }}
                                                onMouseLeave={(e) => { e.target.style.background = "var(--primary)"; }}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProductList;