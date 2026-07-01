import React, { useEffect, useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [product, setProduct] = useState({
        name: "", price: "", imageUrl: "", categories: []
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = () => {
        fetch(`${API}/products`)
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]));
    };

    const loadCategories = () => {
        fetch(`${API}/categories`)
            .then(res => res.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => setCategories([]));
    };

    const uploadImage = (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        fetch(`${API}/upload`, { method: "POST", body: formData })
            .then(res => res.text())
            .then(url => setProduct(p => ({ ...p, imageUrl: url })))
            .catch(err => console.error("Upload failed", err));
    };

    const saveProduct = () => {
        if (!product.name || !product.price) { alert("Name and price are required!"); return; }
        const url = editId ? `${API}/products/${editId}` : `${API}/products`;
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
            alert(editId ? "Product updated!" : "Product added!");
        });
    };

    const deleteProduct = (id) => {
        if (window.confirm("Delete this product?")) {
            fetch(`${API}/products/${id}`, { method: "DELETE" }).then(loadProducts);
        }
    };

    const toggleCategory = (category) => {
        const exists = product.categories.some(c => c.id === category.id);
        setProduct(p => ({
            ...p,
            categories: exists
                ? p.categories.filter(c => c.id !== category.id)
                : [...p.categories, category]
        }));
    };

    const startEdit = (p) => {
        setProduct({ ...p, categories: p.categories || [] });
        setEditId(p.id);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    return (
        <div style={{ background: "#fdf6f9", minHeight: "100vh", padding: "30px 40px", fontFamily: "Arial, sans-serif" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h1 style={{ color: "#c2185b", margin: 0, fontFamily: "Georgia, serif" }}>LUXELOOP</h1>
                    <p style={{ color: "#999", margin: "4px 0 0", fontSize: "13px" }}>Inventory Manager</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setProduct({ name: "", price: "", imageUrl: "", categories: [] }); }}
                        style={{ background: "#c2185b", color: "white", padding: "10px 22px", borderRadius: "25px", border: "none", cursor: "pointer", fontWeight: "600" }}>
                    {showForm ? "✕ Cancel" : "+ Add Product"}
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
                <div style={{ background: "white", padding: "15px 20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", flex: 1, textAlign: "center" }}>
                    <p style={{ margin: 0, color: "#999", fontSize: "12px" }}>TOTAL PRODUCTS</p>
                    <h2 style={{ margin: "5px 0 0", color: "#c2185b" }}>{products.length}</h2>
                </div>
                <div style={{ background: "white", padding: "15px 20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", flex: 1, textAlign: "center" }}>
                    <p style={{ margin: 0, color: "#999", fontSize: "12px" }}>CATEGORIES</p>
                    <h2 style={{ margin: "5px 0 0", color: "#c2185b" }}>{categories.length}</h2>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div style={{ background: "white", padding: "28px", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 4px 20px rgba(194,24,91,0.08)", border: "1px solid #fce4ec" }}>
                    <h2 style={{ color: "#c2185b", marginTop: 0 }}>{editId ? "✏️ Edit Product" : "➕ New Product"}</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                        <input placeholder="Product Name" value={product.name}
                               onChange={e => setProduct(p => ({ ...p, name: e.target.value }))}
                               style={{ padding: "12px 15px", borderRadius: "10px", border: "1px solid #f8bbd0", fontSize: "14px", outline: "none" }} />
                        <input placeholder="Price (₹)" type="number" value={product.price}
                               onChange={e => setProduct(p => ({ ...p, price: e.target.value }))}
                               style={{ padding: "12px 15px", borderRadius: "10px", border: "1px solid #f8bbd0", fontSize: "14px", outline: "none" }} />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ color: "#888", fontSize: "13px" }}>Product Image (JPG/PNG only)</label><br />
                        <input type="file" accept="image/png,image/jpeg,image/jpg"
                               onChange={e => uploadImage(e.target.files[0])}
                               style={{ marginTop: "6px", fontSize: "13px" }} />
                        {product.imageUrl && (
                            <img src={product.imageUrl} alt="preview" width="80"
                                 style={{ borderRadius: "8px", marginTop: "10px", display: "block" }} />
                        )}
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ color: "#888", fontSize: "13px" }}>Categories</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                            {categories.map(c => {
                                const selected = product.categories.some(pc => pc.id === c.id);
                                return (
                                    <button key={c.id} onClick={() => toggleCategory(c)} style={{
                                        padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "13px", fontWeight: "500",
                                        border: selected ? "none" : "1px solid #f8bbd0",
                                        background: selected ? "#c2185b" : "white",
                                        color: selected ? "white" : "#c2185b"
                                    }}>{c.name}</button>
                                );
                            })}
                        </div>
                    </div>

                    <button onClick={saveProduct} style={{
                        background: "#c2185b", color: "white", border: "none",
                        padding: "12px 30px", borderRadius: "25px", cursor: "pointer", fontWeight: "600", fontSize: "15px"
                    }}>{editId ? "Update Product" : "Save Product"}</button>
                </div>
            )}

            {/* Product Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
                {products.map(p => (
                    <div key={p.id} style={{ background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 12px rgba(194,24,91,0.06)", border: "1px solid #fce4ec" }}>
                        <div style={{ background: "#fff5f8", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={p.imageUrl} alt={p.name}
                                 style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }}
                                 onError={e => { e.target.src = "https://placehold.co/150x150?text=No+Image"; }} />
                        </div>
                        <div style={{ padding: "14px" }}>
                            <h3 style={{ margin: "0 0 4px", fontSize: "14px" }}>{p.name}</h3>
                            <p style={{ margin: "0 0 8px", color: "#c2185b", fontWeight: "bold" }}>₹{p.price}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
                                {p.categories && p.categories.map(c => (
                                    <span key={c.id} style={{ background: "#fce4ec", color: "#c2185b", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>{c.name}</span>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => startEdit(p)} style={{ flex: 1, background: "white", color: "#c2185b", border: "1px solid #c2185b", padding: "7px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Edit</button>
                                <button onClick={() => deleteProduct(p.id)} style={{ flex: 1, background: "#ff4757", color: "white", border: "none", padding: "7px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminProducts;