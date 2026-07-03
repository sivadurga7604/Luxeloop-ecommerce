import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./components/OrderHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import Wishlist from "./pages/Wishlist";
import Success from "./components/Success";

// FIX: Protected route - redirects non-admins away from admin pages
function AdminRoute({ element }) {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }
    return element;
}

function Navbar() {
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem("token");
    const isAdmin = localStorage.getItem("role") === "ADMIN";
    const userName = localStorage.getItem("name");

    const linkStyle = (path) => ({
        color: location.pathname === path ? "#800032" : "#605c65",
        textDecoration: "none",
        fontWeight: location.pathname === path ? "700" : "500",
        padding: "8px 16px",
        borderRadius: "20px",
        background: location.pathname === path ? "#fce4ec" : "transparent",
        transition: "all 0.2s ease",
        fontSize: "14.5px",
        whiteSpace: "nowrap"
    });

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        window.location.href = "/login";
    };

    return (
        <div>
            {/* Top Brand Banner */}
            <div style={{
                background: "linear-gradient(135deg, #3d0016, #1f000b)",
                padding: "24px 0 16px",
                textAlign: "center",
                borderBottom: "3px solid #c29b38"
            }}>
                <div style={{
                    color: "#c29b38",
                    fontSize: "36px",
                    fontWeight: "800",
                    letterSpacing: "8px",
                    fontFamily: "'Playfair Display', Georgia, serif"
                }}>
                    LUXELOOP
                </div>
                <div style={{
                    color: "#e2cfa2",
                    fontSize: "11px",
                    letterSpacing: "4px",
                    marginTop: "4px",
                    fontWeight: "500"
                }}>
                    ELEVATE YOUR STYLE
                </div>
            </div>

            {/* Navigation links bar */}
            <div style={{
                background: "#ffffff",
                padding: "12px 25px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                boxShadow: "0 4px 20px rgba(128, 0, 50, 0.05)",
                position: "sticky",
                top: 0,
                zIndex: 100,
                borderBottom: "1px solid #f3e8ec"
            }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                    <Link to="/" style={linkStyle("/")}>Products</Link>
                    <Link to="/cart" style={linkStyle("/cart")}>Cart</Link>
                    <Link to="/wishlist" style={linkStyle("/wishlist")}>Wishlist</Link>
                    <Link to="/checkout" style={linkStyle("/checkout")}>Checkout</Link>
                    <Link to="/orders" style={linkStyle("/orders")}>Orders</Link>

                    {isAdmin && (
                        <>
                            <span style={{ color: "#d8c2cb", padding: "0 4px" }}>|</span>
                            <Link to="/admin" style={linkStyle("/admin")}>Dashboard</Link>
                            <Link to="/admin-products" style={linkStyle("/admin-products")}>Manage Products</Link>
                        </>
                    )}
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {isLoggedIn && userName && (
                        <span style={{ fontSize: "14px", color: "#605c65", marginRight: "5px" }}>
                            Hello, <strong style={{ color: "#800032" }}>{userName}</strong>
                        </span>
                    )}

                    {isLoggedIn ? (
                        <button onClick={logout} style={{
                            background: "transparent",
                            color: "#800032",
                            border: "1.5px solid #800032",
                            padding: "8px 18px",
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontSize: "13.5px",
                            fontWeight: "600"
                        }}
                        onMouseEnter={(e) => { e.target.style.background = "#800032"; e.target.style.color = "white"; }}
                        onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#800032"; }}
                        >
                            Logout
                        </button>
                    ) : (
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <Link to="/login" style={linkStyle("/login")}>Login</Link>
                            <Link to="/register" style={{
                                ...linkStyle("/register"),
                                background: "#800032",
                                color: "white",
                                fontWeight: "600"
                            }}
                            onMouseEnter={(e) => { e.target.style.background = "#a31d4f"; }}
                            onMouseLeave={(e) => { e.target.style.background = "#800032"; }}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/success" element={<Success />} />

                {/* FIX: Admin routes protected - only ADMIN role can access */}
                <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
                <Route path="/admin-products" element={<AdminRoute element={<AdminProducts />} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;