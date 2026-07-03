import React, { useEffect, useState } from "react";
import { API, getImageUrl } from "../config";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState({
        name: "", price: "", imageUrl: "", categories: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);

        fetch(`${API}/products`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch products: " + res.status);
                return res.json();
            })
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Products load error:", err);
                setProducts([]);
            });

        fetch(`${API}/categories`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch categories: " + res.status);
                return res.json();
            })
            .then(data => {
                setCategories(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Categories load error:", err);
                setCategories([]);
                setLoading(false);
            });
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
        if (!product.name || !product.price) { 
            alert("Name and price are required!"); 
            return; 
        }
        const url = editId ? `${API}/products/${editId}` : `${API}/products`;
        const method = editId ? "PUT" : "POST";
        
        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to save product: Status " + res.status);
            return res.json();
        })
        .then(() => {
            setProduct({ name: "", price: "", imageUrl: "", categories: [] });
            setEditId(null);
            setShowForm(false);
            loadData();
            alert(editId ? "Product updated!" : "Product added!");
        })
        .catch(err => {
            console.error("Save product error:", err);
            alert("Error saving product: " + err.message);
        });
    };

    const deleteProduct = (id) => {
        if (window.confirm("Delete this product?")) {
            fetch(`${API}/products/${id}`, { method: "DELETE" })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to delete product: Status " + res.status);
                    loadData();
                })
                .catch(err => {
                    console.error("Delete product error:", err);
                    alert("Error deleting product: " + err.message);
                });
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
        <div style={{ padding: "40px 5%", maxWidth: "1400px", margin: "0 auto" }} className="fade-in">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h1 style={{ color: "var(--primary-dark)", margin: 0 }}>Inventory Management</h1>
                    <p style={{ color: "var(--text-secondary)", margin: "4px 0 0", fontSize: "14px" }}>Create and edit boutique product collections</p>
                </div>
                <button 
                    onClick={() => { 
                        setShowForm(!showForm); 
                        setEditId(null); 
                        setProduct({ name: "", price: "", imageUrl: "", categories: [] }); 
                    }}
                    style={{ 
                        background: "var(--primary)", 
                        color: "white", 
                        padding: "10px 22px", 
                        borderRadius: "25px", 
                        border: "none", 
                        cursor: "pointer", 
                        fontWeight: "600",
                        fontSize: "14px"
                    }}
                    onMouseEnter={(e) => { e.target.style.background = "var(--primary-light)"; }}
                    onMouseLeave={(e) => { e.target.style.background = "var(--primary)"; }}
                >
                    {showForm ? "✕ Cancel" : "+ Add Product"}
                </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "35px" }}>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)", flex: 1, textAlign: "center" }}>
                    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13px", fontWeight: "600" }}>TOTAL CATALOG ITEMS</p>
                    <h2 style={{ margin: "5px 0 0", color: "var(--primary)" }}>{products.length}</h2>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)", flex: 1, textAlign: "center" }}>
                    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13px", fontWeight: "600" }}>ACTIVE CATEGORIES</p>
                    <h2 style={{ margin: "5px 0 0", color: "var(--primary)" }}>{categories.length}</h2>
                </div>
            </div>

            {/* Product Add/Edit Form */}
            {showForm && (
                <div style={{ 
                    background: "white", 
                    padding: "30px", 
                    borderRadius: "16px", 
                    marginBottom: "35px", 
                    boxShadow: "var(--shadow-md)", 
                    border: "1px solid var(--border-color)" 
                }}>
                    <h2 style={{ color: "var(--primary-dark)", marginTop: 0, marginBottom: "20px", fontSize: "20px" }}>
                        {editId ? "✏️ Edit Product Details" : "➕ Add New Product"}
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Product Name</label>
                            <input 
                                placeholder="e.g., Silk Evening Dress" 
                                value={product.name}
                                onChange={e => setProduct(p => ({ ...p, name: e.target.value }))}
                                style={{ width: "100%" }} 
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Price (₹)</label>
                            <input 
                                placeholder="Price in ₹" 
                                type="number" 
                                value={product.price}
                                onChange={e => setProduct(p => ({ ...p, price: e.target.value }))}
                                style={{ width: "100%" }} 
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Product Image</label>
                        <input 
                            type="file" 
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={e => uploadImage(e.target.files[0])}
                            style={{ display: "block", marginTop: "6px" }} 
                        />
                        {product.imageUrl && (
                            <img 
                                src={getImageUrl(product.imageUrl)} 
                                alt="preview" 
                                width="100"
                                style={{ borderRadius: "8px", marginTop: "15px", display: "block", border: "1px solid var(--border-color)" }} 
                            />
                        )}
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "8px" }}>Assign Categories</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {categories.map(c => {
                                const selected = product.categories.some(pc => pc.id === c.id);
                                return (
                                    <button 
                                        key={c.id} 
                                        type="button"
                                        onClick={() => toggleCategory(c)} 
                                        style={{
                                            padding: "8px 18px", 
                                            borderRadius: "20px", 
                                            cursor: "pointer", 
                                            fontSize: "13px", 
                                            fontWeight: "600",
                                            border: selected ? "none" : "1px solid var(--border-color)",
                                            background: selected ? "var(--primary)" : "white",
                                            color: selected ? "white" : "var(--primary)"
                                        }}
                                    >
                                        {c.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        onClick={saveProduct} 
                        style={{
                            background: "var(--primary)", 
                            color: "white", 
                            border: "none",
                            padding: "12px 30px", 
                            borderRadius: "8px", 
                            cursor: "pointer", 
                            fontWeight: "600", 
                            fontSize: "15px"
                        }}
                        onMouseEnter={(e) => { e.target.style.background = "var(--primary-light)"; }}
                        onMouseLeave={(e) => { e.target.style.background = "var(--primary)"; }}
                    >
                        {editId ? "Update Product" : "Save Product"}
                    </button>
                </div>
            )}

            {/* Catalog Grid */}
            {loading ? (
                <p style={{ color: "var(--text-secondary)" }}>Loading catalog...</p>
            ) : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--border-color)", borderRadius: "12px" }}>
                    <p style={{ color: "var(--text-secondary)" }}>Your catalog is empty.</p>
                </div>
            ) : (
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
                    gap: "25px" 
                }}>
                    {products.map(p => (
                        <div 
                            key={p.id} 
                            style={{ 
                                background: "white", 
                                borderRadius: "16px", 
                                overflow: "hidden", 
                                boxShadow: "var(--shadow-sm)", 
                                border: "1px solid var(--border-color)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            <div style={{ 
                                background: "#fff", 
                                height: "180px", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                padding: "10px"
                            }}>
                                <img 
                                    src={getImageUrl(p.imageUrl)} 
                                    alt={p.name}
                                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                    onError={e => { e.target.src = "https://placehold.co/150x150?text=No+Image"; }} 
                                />
                            </div>
                            
                            <div style={{ padding: "18px", borderTop: "1px solid var(--border-color)" }}>
                                <h3 style={{ margin: "0 0 4px", fontSize: "15px", color: "var(--primary-dark)" }}>{p.name}</h3>
                                <p style={{ margin: "0 0 12px", color: "var(--primary-light)", fontWeight: "700" }}>₹{p.price.toLocaleString("en-IN")}</p>
                                
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "15px", minHeight: "22px" }}>
                                    {p.categories && p.categories.map(c => (
                                        <span 
                                            key={c.id} 
                                            style={{ 
                                                background: "#fce4ec", 
                                                color: "var(--primary)", 
                                                padding: "3px 10px", 
                                                borderRadius: "12px", 
                                                fontSize: "11px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {c.name}
                                        </span>
                                    ))}
                                </div>
                                
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button 
                                        onClick={() => startEdit(p)} 
                                        style={{ 
                                            flex: 1, 
                                            background: "white", 
                                            color: "var(--primary)", 
                                            border: "1.5px solid var(--primary)", 
                                            padding: "8px", 
                                            borderRadius: "8px", 
                                            cursor: "pointer", 
                                            fontSize: "13px", 
                                            fontWeight: "600" 
                                        }}
                                        onMouseEnter={(e) => { e.target.style.background = "#fce4ec"; }}
                                        onMouseLeave={(e) => { e.target.style.background = "white"; }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteProduct(p.id)} 
                                        style={{ 
                                            flex: 1, 
                                            background: "#e53935", 
                                            color: "white", 
                                            border: "none", 
                                            padding: "8px", 
                                            borderRadius: "8px", 
                                            cursor: "pointer", 
                                            fontSize: "13px", 
                                            fontWeight: "600" 
                                        }}
                                        onMouseEnter={(e) => { e.target.style.background = "#b71c1c"; }}
                                        onMouseLeave={(e) => { e.target.style.background = "#e53935"; }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminProducts;