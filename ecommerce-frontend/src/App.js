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

    const linkStyle = (path) => ({
        color: "white",
        textDecoration: "none",
        fontWeight: location.pathname === path ? "700" : "500",
        padding: "8px 14px",
        borderRadius: "20px",
        background: location.pathname === path ? "rgba(255,255,255,0.25)" : "transparent",
        transition: "all 0.2s",
        fontSize: "14px",
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
            <div style={{
                background: "linear-gradient(135deg, #3d0a1f, #800032)",
                padding: "18px 0 12px",
                textAlign: "center"
            }}>
                <div style={{
                    color: "#ff4d8d",
                    fontSize: "32px",
                    fontWeight: "800",
                    letterSpacing: "6px",
                    fontFamily: "Georgia, serif"
                }}>
                    LUXELOOP
                </div>
                <div style={{
                    color: "#f5b6cf",
                    fontSize: "12px",
                    letterSpacing: "3px",
                    marginTop: "2px"
                }}>
                    ELEVATE YOUR STYLE
                </div>
            </div>

            <div style={{
                background: "linear-gradient(90deg, #ff4d8d, #c2185b)",
                padding: "14px 25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}>
                <Link to="/" style={linkStyle("/")}>Products</Link>
                <Link to="/cart" style={linkStyle("/cart")}>Cart</Link>
                <Link to="/wishlist" style={linkStyle("/wishlist")}>Wishlist</Link>
                <Link to="/checkout" style={linkStyle("/checkout")}>Checkout</Link>
                <Link to="/orders" style={linkStyle("/orders")}>Orders</Link>

                {/* FIX: only show admin links to ADMIN users */}
                {isAdmin && (
                    <>
                        <Link to="/admin" style={linkStyle("/admin")}>Dashboard</Link>
                        <Link to="/admin-products" style={linkStyle("/admin-products")}>Manage</Link>
                    </>
                )}

                {isLoggedIn ? (
                    <button onClick={logout} style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.4)",
                        padding: "7px 16px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600"
                    }}>
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle("/login")}>Login</Link>
                        <Link to="/register" style={{
                            ...linkStyle("/register"),
                            background: "white",
                            color: "#c2185b",
                            fontWeight: "700"
                        }}>
                            Register
                        </Link>
                    </>
                )}
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