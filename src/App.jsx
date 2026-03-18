import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;