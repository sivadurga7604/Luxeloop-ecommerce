import React from "react";

function Navbar() {
    // Look for login token to toggle button visibility
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = (e) => {
        e.preventDefault(); // 🌟 Crucial: Stops browser page-link refresh errors

        // Clear login details
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        // Take them back to the guest home page safely
        window.location.href = "/";
    };

    return (
        <nav style={{
            padding: "15px 30px",
            background: "#d53f8c",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <div style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>LUXELOOP</div>
            <div>
                <a href="/" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Products</a>
                <a href="/cart" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Cart</a>

                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "transparent",
                            border: "1px solid white",
                            color: "white",
                            padding: "6px 15px",
                            borderRadius: "20px",
                            cursor: "pointer"
                        }}>
                        Logout
                    </button>
                ) : (
                    <>
                        <a href="/login" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Login</a>
                        <a href="/register" style={{ color: "white", textDecoration: "none" }}>Register</a>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;