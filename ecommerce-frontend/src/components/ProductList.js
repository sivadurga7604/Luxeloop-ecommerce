import React, { useEffect, useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [wishlistIds, setWishlistIds] = useState([]);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        loadProducts(null);
        loadCategories();
        loadWishlist();
    }, []);

    // Helper to resolve image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return "https://placehold.co/150x150?text=No+Image";
        // If it's a relative path like /uploads/..., prepend the API URL
        if (imageUrl.startsWith("/")) return `${API}${imageUrl}`;
        return imageUrl;
    };

    const loadCategories = () => {
        fetch(`${API}/categories`)
            .then(res => {
                if (!res.ok) throw new Error("Server returned " + res.status);
                return res.json();
            })
            .then(data => setCategories(data))
            .catch(err => console.error("Could not load categories. Check your Backend URL:", err));
    };

    const loadProducts = (categoryId) => {
        const url = categoryId
            ? `${API}/products/category/${categoryId}`
            : `${API}/products`;
        fetch(url)
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []));
    };

    const loadWishlist = () => {
        if (!userId) return;
        fetch(`${API}/wishlist/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setWishlistIds(data.map(w => w.productId));
            })
            .catch(() => setWishlistIds([]));
    };

    const handleTabClick = (categoryId) => {
        setActiveCategory(categoryId);
        setSearchTerm("");
        loadProducts(categoryId);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setActiveCategory(null);
        if (term.trim() === "") { loadProducts(null); return; }
        fetch(`${API}/products/search?name=${encodeURIComponent(term)}`)
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []));
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
            if (res.ok) alert(product.name + " added to cart!");
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

    const tabStyle = (isActive) => ({
        padding: "10px 20px",
        marginRight: "10px",
        marginBottom: "20px",
        borderRadius: "20px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        background: isActive ? "#c2185b" : "#ffe0ec",
        color: isActive ? "white" : "#c2185b"
    });

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ color: "#333" }}>Products</h1>
            <input
                type="text"
                placeholder="🔍 Search products..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                style={{
                    width: "100%", maxWidth: "400px", padding: "12px 15px",
                    marginBottom: "20px", borderRadius: "25px",
                    border: "1px solid #ffc1d9", fontSize: "15px",
                    outline: "none", display: "block"
                }}
            />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <button style={tabStyle(activeCategory === null && searchTerm === "")} onClick={() => handleTabClick(null)}>All</button>
                {categories.map(c => (
                    <button key={c.id} style={tabStyle(activeCategory === c.id)} onClick={() => handleTabClick(c.id)}>{c.name}</button>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.length === 0 && <p>No products found.</p>}
                {products.map(p => {
                    const isWishlisted = wishlistIds.includes(p.id);
                    return (
                        <div key={p.id} style={{
                            background: "#fff", borderRadius: "10px", padding: "15px",
                            textAlign: "center", boxShadow: "0 2px 8px rgba(194,24,91,0.1)",
                            position: "relative"
                        }}>
                            <span onClick={() => toggleWishlist(p)} style={{
                                position: "absolute", top: "10px", right: "10px",
                                fontSize: "22px", cursor: "pointer", userSelect: "none"
                            }}>
                                {isWishlisted ? "❤️" : "🤍"}
                            </span>
                            <img
                                src={getImageUrl(p.imageUrl)}
                                alt={p.name}
                                width="150" height="150"
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                                onError={(e) => {
                                    e.target.onerror = null; // THIS STOPS THE INFINITE LOOP
                                    e.target.src = "https://placehold.co/150x150?text=No+Image";
                                }}
                            />
                            <h3>{p.name}</h3>
                            <p style={{ fontWeight: "bold", color: "#c2185b" }}>₹{p.price}</p>
                            <button onClick={() => addToCart(p)} style={{
                                background: "#c2185b", color: "white", border: "none",
                                padding: "8px 20px", borderRadius: "6px", cursor: "pointer", marginTop: "10px"
                            }}>Add to Cart</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProductList;