import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setToken, setRole } from '../helper';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string().email('Enter a valid email').required('Email is required'),
        password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 aurora">
            <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-up">
                <div className="text-center space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">Welcome back</p>
                    <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                    <p className="text-sm text-gray-500">Stay on top of your attendance & leave requests.</p>
                </div>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                        setStatus(null);
                        try {
                            const response = await api.post('/auth/login', values);
                            const data = response.data;
                            setToken(data.token);
                            setRole(data.user.role);
                            navigate(data.user.role === 'admin' ? '/admin' : '/employee');
                        } catch (error) {
                            console.error('Login error:', error);
                            setStatus(error.response?.data?.message || 'Login failed');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting, status }) => (
                        <Form className="mt-6 space-y-6 card shadow-lg hover-lift">
                            <div className="card-body space-y-4">
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="input-field"
                                        placeholder="you@example.com"
                                    />
                                    <ErrorMessage name="email" component="p" className="text-xs text-red-600" />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        className="input-field"
                                        placeholder="Enter password"
                                    />
                                    <ErrorMessage name="password" component="p" className="text-xs text-red-600" />
                                </div>

                                {status && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-2">{status}</div>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`btn-primary w-full flex justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/signup')}
                                        className="text-indigo-600 hover:text-indigo-500 transition"
                                    >
                                        Don&apos;t have an account? Sign up
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
