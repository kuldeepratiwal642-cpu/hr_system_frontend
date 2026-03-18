import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { fullName, email, password });
            alert('Registration successful. Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Signup failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="fullName" className="sr-only">Full Name</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                className="input-field appearance-none rounded-none rounded-t-md focus:z-10"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input-field appearance-none rounded-none focus:z-10"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="input-field appearance-none rounded-none rounded-b-md focus:z-10"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="btn-primary w-full flex justify-center"
                        >
                            Sign up
                        </button>
                    </div>
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;