import React from "react";

function ProductForm() {
    return (
        <div style={{ padding: "20px" }}>
            <h2>Add Product</h2>

            <input
                type="text"
                placeholder="Product Name"
                style={{ margin: "5px", padding: "8px" }}
            />

            <input
                type="number"
                placeholder="Price"
                style={{ margin: "5px", padding: "8px" }}
            />

            <button style={{ padding: "8px 15px" }}>
                Add Product
            </button>
        </div>
    );
}
export default ProductForm;