import React from 'react';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../hook/UseAxiosSecure'; // ⚠️ !! Update this path !!
import { DollarSign, Users, UserCheck, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UseAuth from '../hook/UseAuth';

/**
 * A reusable stat card.
 */
const StatCard = ({ title, value, icon }) => (
  <div className={`bg-zinc-800 p-5 rounded-lg border border-zinc-700 flex items-center gap-4`}>
    <div className="p-3 rounded-lg bg-zinc-900">
      {icon}
    </div>
    <div>
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

/**
 * The main Admin Dashboard component.
 */
const AdminDashboard = () => {
  const { user } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  // Fetch all admin stats from the new endpoint
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    // ✅ --- THIS IS THE FIX --- ✅
    // Changed 'fn' to 'queryFn' as required by react-query
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
      return res.data.data;
    }
  });

  if (isLoading) {
    return <div className="mt-8 text-zinc-300">Loading Admin Dashboard...</div>;
  }

  if (isError || !stats) {
    return (
      <div className="p-6 bg-red-800 text-red-100 rounded-lg flex items-center gap-4">
        <AlertTriangle className="w-8 h-8" />
        <div>
          <h3 className="font-bold">Failed to load admin data.</h3>
          <p>You may not have permission to view this, or the server is down.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-zinc-300">Welcome, {user.name}. Here is the business overview.</p>

      {/* --- STATS CARDS --- */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 text-green-500" />} 
        />
        <StatCard 
          title="Total Clients" 
          value={stats.totalClients} 
          icon={<Users className="w-6 h-6 text-blue-500" />} 
        />
        <StatCard 
          title="Total Staff" 
          value={stats.totalTrainers} 
          icon={<UserCheck className="w-6 h-6 text-red-500" />} 
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- MAIN CONTENT: REVENUE CHART (2/3 width) --- */}
        <div className="lg:col-span-2 bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-2xl font-semibold text-white mb-4">Revenue (Last 30 Days)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={stats.revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} 
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#EF4444" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- SIDEBAR: RECENT ENROLLMENTS (1/3 width) --- */}
        <div className="lg:col-span-1 bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-2xl font-semibold text-white mb-4">Recent Enrollments</h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {stats.recentEnrollments.map(enrollment => (
              <div key={enrollment._id} className="p-3 bg-zinc-900 rounded-lg">
                
                {/* We use optional chaining (?.) to prevent a crash if 'client' is null */}
                <p className="font-medium text-white">
                  {enrollment.client?.name || 'Unknown Client'}
                </p>
                <p className="text-sm text-zinc-400">
                  Enrolled in <span className="font-medium text-red-400">
                    {/* Also added a fix here for the class name */}
                    {enrollment.classId?.name || 'Unknown Class'}
                  </span>
                </p>
                
                <p className="text-xs text-zinc-500">{new Date(enrollment.createdAt).toLocaleString()}</p>
              </div>
            ))}
            {stats.recentEnrollments.length === 0 && (
              <p className="text-sm text-zinc-500">No recent enrollments.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

