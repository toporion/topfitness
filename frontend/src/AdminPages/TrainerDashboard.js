import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import UseAxiosSecure from '../hook/UseAxiosSecure'; // ⚠️ !! Update thisD path !!
import { Users, ClipboardCheck, Activity, Search, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UseAuth from '../hook/UseAuth';

/**
 * A reusable stat card.
 */
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className={`bg-zinc-800 p-5 rounded-lg border border-zinc-700 flex items-center gap-4 ${bgColor}`}>
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
 * The main Trainer Dashboard component.
 */
const TrainerDashboard = () => {
  const { user } = UseAuth();
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Trainer's Enrolled Clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['my-clients-list'], // We can reuse this key
    queryFn: async () => {
      const res = await axiosSecure.get('/my-clients');
      return res.data.data;
    }
  });

  // 2. Fetch Trainer's Created Nutrition Plans
  const { data: nutritionPlans = [], isLoading: nutritionLoading } = useQuery({
    queryKey: ['my-created-nutrition-plans'],
    queryFn: async () => {
      // This will automatically return only the trainer's plans
      const res = await axiosSecure.get('/nutrition-plans');
      console.log(res);
      return res.data.data;
    }
  });

  // 3. Fetch Trainer's Created Workout Plans
  const { data: workoutPlans = [], isLoading: workoutLoading } = useQuery({
    queryKey: ['my-created-workout-plans'],
    queryFn: async () => {
      const res = await axiosSecure.get('/workout-plans');
      return res.data.data;
    }
  });

  const isLoading = clientsLoading || nutritionLoading || workoutLoading;

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
      <p className="mt-2 text-zinc-300">Welcome, {user.name}. Let's manage your clients.</p>

      {isLoading && <div className="mt-8 text-zinc-300">Loading your data...</div>}

      {!isLoading && (
        <>
          {/* --- STATS CARDS --- */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Clients" 
              value={clients.length} 
              icon={<Users className="w-6 h-6 text-red-500" />} 
            />
            <StatCard 
              title="Nutrition Plans" 
              value={nutritionPlans.length} 
              icon={<ClipboardCheck className="w-6 h-6 text-red-500" />} 
            />
            <StatCard 
              title="Workout Plans" 
              value={workoutPlans.length} 
              icon={<Activity className="w-6 h-6 text-red-500" />} 
            />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* --- MAIN CONTENT: CLIENT LIST (2/3 width) --- */}
            <div className="lg:col-span-2 bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h2 className="text-2xl font-semibold text-white mb-4">My Enrolled Clients</h2>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <Search className="h-5 w-5 text-zinc-400 absolute left-3 top-3.5" />
              </div>

              {/* Client Table */}
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-zinc-900 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Client</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {filteredClients.map(client => (
                      <tr key={client._id} className="hover:bg-zinc-700">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={client.profileImage || `https://placehold.co/40x40/3F3F46/9CA3AF?text=${client.name[0]}`}
                              alt={client.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-medium">{client.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{client.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button 
                            // This could navigate to a "Manage Client" page
                            className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-1"
                          >
                            <Edit size={14} />
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredClients.length === 0 && (
                  <div className="text-center py-10 text-zinc-500">
                    {clients.length === 0 ? "You have no clients." : "No clients match your search."}
                  </div>
                )}
              </div>
            </div>

            {/* --- SIDEBAR: RECENT PLANS (1/3 width) --- */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4">My Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => navigate('/admin/nutrion-plan')} 
                    className="w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
                  >
                    Create Nutrition Plan
                  </button>
                  <button 
                    onClick={() => navigate('/admin/workout-plan')} 
                    className="w-full text-center bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
                  >
                    Create Workout Plan
                  </button>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {nutritionPlans.slice(0, 3).map(plan => (
                    <div key={plan._id} className="flex items-start gap-3">
                      <ClipboardCheck className="w-5 h-5 text-red-500 mt-1" />
                      <p className="text-sm text-zinc-300">
                        You created <strong>{plan.planName}</strong>
                      </p>
                    </div>
                  ))}
                  {workoutPlans.slice(0, 3).map(plan => (
                    <div key={plan._id} className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-red-500 mt-1" />
                      <p className="text-sm text-zinc-300">
                        You created <strong>{plan.planName}</strong>
                      </p>
                    </div>
                  ))}
                  {nutritionPlans.length === 0 && workoutPlans.length === 0 && (
                    <p className="text-sm text-zinc-500">No recent plan activity.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default TrainerDashboard;
