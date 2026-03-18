import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getRole } from '../helper';

const ProtectedRoute = ({ children, role }) => {
    const token = getToken();
    const userRole = getRole();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (userRole !== role) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;