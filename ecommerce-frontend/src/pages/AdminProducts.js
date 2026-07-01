import React, { useEffect, useState } from "react";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [product, setProduct] = useState({
        name: "",
        price: "",
        imageUrl: "",
        categories: []
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = () => {
        fetch("https://luxeloop-backend.onrender.com/products")
            .then(res => res.ok ? res.json() : [])
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]));
    };

    const loadCategories = () => {
        fetch("https://luxeloop-backend.onrender.com/categories")
            .then(res => res.ok ? res.json() : [])
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => setCategories([]));
    };

    const uploadImage = (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        fetch("https://luxeloop-backend.onrender.com/upload", {
            method: "POST",
            body: formData
        })
            .then(res => res.text())
            .then(url => setProduct({ ...product, imageUrl: url }))
            .catch(err => console.error("Upload failed", err));
    };

    const saveProduct = () => {
        const url = editId
            ? `https://luxeloop-backend.onrender.com/products/${editId}`
            : "https://luxeloop-backend.onrender.com/products";
        const method = editId ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        }).then(() => {
            setProduct({ name: "", price: "", imageUrl: "", categories: [] });
            setEditId(null);
            setShowForm(false);
            loadProducts();
        });
    };

    const deleteProduct = (id) => {
        if (window.confirm("Delete this product?")) {
            fetch(`https://luxeloop-backend.onrender.com/products/${id}`, {
                method: "DELETE"
            }).then(loadProducts);
        }
    };

    const toggleCategory = (category) => {
        const currentCats = product.categories || [];
        const exists = currentCats.some(c => c.id === category.id);
        setProduct({
            ...product,
            categories: exists
                ? currentCats.filter(c => c.id !== category.id)
                : [...currentCats, category]
        });
    };

    return (
        <div style={{ background: "#fdf6f9", minHeight: "100vh", padding: "30px 40px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1 style={{ color: "#c2185b", margin: 0 }}>LUXELOOP Inventory</h1>
                <button onClick={() => setShowForm(!showForm)} style={{ background: "#c2185b", color: "white", padding: "10px 22px", borderRadius: "25px", border: "none", cursor: "pointer" }}>
                    {showForm ? "✕ Cancel" : "+ Add Product"}
                </button>
            </div>

            {/* Product Grid - Using Defensive Array Mapping */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
                {Array.isArray(products) && products.map(p => (
                    <div key={p.id} style={{ background: "white", borderRadius: "14px", padding: "15px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                        <img src={p.imageUrl} alt={p.name} width="100%" onError={e => e.target.src = "https://via.placehold.com/150x150?text=No+Image"} />
                        <h3>{p.name}</h3>
                        <p>₹{p.price}</p>
                        <button onClick={() => deleteProduct(p.id)} style={{ background: "#ff4757", color: "white", border: "none", padding: "8px" }}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminProducts;