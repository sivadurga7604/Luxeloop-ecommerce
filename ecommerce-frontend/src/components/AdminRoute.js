import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const role = localStorage.getItem('role');

    // Check if the user is an admin
    return role === 'ADMIN' ? children : <Navigate to="/" />;
};

export default AdminRoute;