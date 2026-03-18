import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { clearStorage } from '../helper';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersRes = await api.post('/admin/users', {});
            setUsers(usersRes.data);

            const leavesRes = await api.post('/leave/admin/all', {});
            setLeaves(leavesRes.data);

            const attRes = await api.post('/attendance/admin/all', {});
            setAttendances(attRes.data);
        } catch (error) {
            console.error('Fetch data error:', error);
            alert('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveAction = async (leaveId, action) => {
        try {
            await api.post('/leave/admin/action', { leaveId, action });
            alert(`Leave ${action}ed successfully`);
            fetchData();
        } catch (error) {
            console.error('Leave action error:', error);
            alert('Action failed');
        }
    };

    const handleLogout = () => {
        clearStorage();
        navigate('/login');
    };

    // Statistics
    const totalEmployees = users.length;
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
    const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
    // frontend ke local timezone ke hisaab se date

    // --- GET TODAY IN UTC ---
    // today in local timezone
    const today = new Date().toDateString();

const presentToday = attendances.filter(a => {
    return new Date(a.date).toDateString() === today 
           && a.status === 'Present';
}).length;

    // Filtered data
    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredLeaves = leaves.filter(leave => {
        if (filterStatus === 'all') return true;
        return leave.status === filterStatus;
    }).sort((a, b) => {
        if (a.status === 'Pending') return -1;
        if (b.status === 'Pending') return 1;
        return 0;
    });

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur shadow sticky top-0 z-50 animate-fade-up">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Welcome Admin - Manage employees, leaves & attendance</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0 space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                        <div className="card glass-card bg-blue-50 border-l-4 border-blue-500 animate-fade-up animate-stagger-1 hover-lift">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl">👥</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dt className="text-sm font-medium text-gray-500">Total Employees</dt>
                                        <dd className="text-2xl font-bold text-blue-600 mt-1">{totalEmployees}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card glass-card bg-yellow-50 border-l-4 border-yellow-500 animate-fade-up animate-stagger-2 hover-lift">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white text-xl">⏳</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dt className="text-sm font-medium text-gray-500">Pending Leaves</dt>
                                        <dd className="text-2xl font-bold text-yellow-600 mt-1">{pendingLeaves}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card glass-card bg-green-50 border-l-4 border-green-500 animate-fade-up animate-stagger-3 hover-lift">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white text-xl">✓</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dt className="text-sm font-medium text-gray-500">Approved Leaves</dt>
                                        <dd className="text-2xl font-bold text-green-600 mt-1">{approvedLeaves}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card glass-card bg-purple-50 border-l-4 border-purple-500 animate-fade-up animate-stagger-4 hover-lift">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white text-xl">📍</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dt className="text-sm font-medium text-gray-500">Present Today</dt>
                                        <dd className="text-2xl font-bold text-purple-600 mt-1">{presentToday}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card glass-card bg-indigo-50 border-l-4 border-indigo-500 animate-fade-up animate-stagger-1 hover-lift">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white text-xl">📊</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dt className="text-sm font-medium text-gray-500">Total Records</dt>
                                        <dd className="text-2xl font-bold text-indigo-600 mt-1">{attendances.length}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6 bg-white rounded-t-lg">
                        <div className="flex space-x-8 px-6">
                            {['overview', 'employees', 'leaves', 'attendance'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition ${activeTab === tab
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Employees Tab */}
                    {activeTab === 'employees' && (
                        <div className="card">
                            <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Employees</h3>
                                <p className="text-sm text-gray-600 mt-1">Total: {filteredUsers.length}</p>
                            </div>
                            <div className="card-body">
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="🔍 Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="input-field w-full"
                                    />
                                </div>
                                {filteredUsers.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {filteredUsers.map(user => (
                                                    <tr key={user._id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.fullName}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {new Date(user.dateOfJoining).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No employees found</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Leaves Tab */}
                    {activeTab === 'leaves' && (
                        <div className="card">
                            <div className="card-header bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
                                <p className="text-sm text-gray-600 mt-1">Pending: {pendingLeaves} | Approved: {approvedLeaves}</p>
                            </div>
                            <div className="card-body">
                                <div className="mb-6 flex space-x-2 flex-wrap gap-2">
                                    {['all', 'Pending', 'Approved', 'Rejected'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status === 'all' ? 'all' : status)}
                                            className={`px-4 py-2 rounded text-sm font-medium transition ${filterStatus === (status === 'all' ? 'all' : status)
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    {filteredLeaves.length > 0 ? (
                                        filteredLeaves.map(leave => (
                                            <div key={leave._id} className="border rounded-lg p-4 hover:shadow-lg transition bg-white hover:bg-gray-50">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 flex-wrap gap-2">
                                                            <h4 className="text-lg font-semibold text-gray-900">{leave.employee?.fullName}</h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${leave.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : leave.status === 'Approved'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {leave.status}
                                                            </span>
                                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                                {leave.leaveType}
                                                            </span>
                                                        </div>
                                                        <p className="mt-3 text-sm text-gray-600">
                                                            📅 {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                            <span className="font-semibold ml-2">({leave.totalDays} days)</span>
                                                        </p>
                                                        {leave.reason && <p className="mt-2 text-sm text-gray-600">📝 <strong>Reason:</strong> {leave.reason}</p>}
                                                    </div>
                                                    {leave.status === 'Pending' && (
                                                        <div className="flex space-x-2 ml-4 flex-shrink-0">
                                                            <button
                                                                onClick={() => handleLeaveAction(leave._id, 'approve')}
                                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold transition shadow hover:shadow-lg"
                                                            >
                                                                ✓ Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleLeaveAction(leave._id, 'reject')}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold transition shadow hover:shadow-lg"
                                                            >
                                                                ✕ Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No leaves found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Tab */}
                    {activeTab === 'attendance' && (
                        <div className="card">
                            <div className="card-header bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
                                <p className="text-sm text-gray-600 mt-1">Total records: {attendances.length}</p>
                            </div>
                            <div className="card-body">
                                {attendances.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Employee</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {attendances.slice(0, 50).map(att => (
                                                    <tr key={att._id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{att.employee?.fullName || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {new Date(att.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${att.status === 'Present'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {att.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {attendances.length > 50 && (
                                            <p className="text-center text-gray-500 mt-4 text-sm">Showing 50 of {attendances.length} records</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No attendance records found</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Quick Stats */}
                            <div className="card">
                                <div className="card-header bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                                    <h3 className="text-lg font-semibold">Leave Summary</h3>
                                </div>
                                <div className="card-body space-y-3">
                                    <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg hover:shadow transition">
                                        <span className="text-gray-700 font-medium">⏳ Pending Leaves</span>
                                        <span className="text-3xl font-bold text-yellow-600">{pendingLeaves}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg hover:shadow transition">
                                        <span className="text-gray-700 font-medium">✓ Approved Leaves</span>
                                        <span className="text-3xl font-bold text-green-600">{approvedLeaves}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg hover:shadow transition">
                                        <span className="text-gray-700 font-medium">✕ Rejected Leaves</span>
                                        <span className="text-3xl font-bold text-red-600">{leaves.filter(l => l.status === 'Rejected').length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="card">
                                <div className="card-header bg-gradient-to-r from-orange-50 to-red-50 border-b">
                                    <h3 className="text-lg font-semibold">Recent Leave Requests</h3>
                                </div>
                                <div className="card-body space-y-3">
                                    {leaves.slice(0, 5).length > 0 ? (
                                        leaves.slice(0, 5).map(leave => (
                                            <div key={leave._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{leave.employee?.fullName}</p>
                                                    <p className="text-xs text-gray-600">{leave.leaveType} • {leave.totalDays} days</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${leave.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : leave.status === 'Approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">No leaves yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
