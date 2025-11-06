import React from 'react';
// Assuming your hook is at '../hook/UseAuth' and exports 'useAuth'

import { Frown } from 'lucide-react';

// 1. IMPORT the "pro" dashboards from their actual files
import ClientDashboard from './ClientDashboard'; 
import TrainerDashboard from './TrainerDashboard';
import AdminDashboard from './AdminDashboard';
import UseAuth from '../hook/UseAuth';

// 2. We DELETE all the old placeholder components. No more const AdminDashboard = ... here.

/**
 * This component is the main "Role Router".
 * It checks the logged-in user's role from AuthContext
 * and renders the correct professional dashboard.
 */
const AdminHome = () => {
    // 3. Get the user from your context
    const { user, loading } = UseAuth(); // Changed UseAuth to useAuth (standard hook naming)

    // Show a loading state
    if (loading || !user) {
        return <div className="text-zinc-300">Loading Dashboard...</div>;
    }

    // 4. Render the correct IMPORTED dashboard based on role
    switch (user.role) {
        case 'admin':
        case 'manager':
            // This now renders the REAL AdminDashboard from the Canvas
            return <AdminDashboard />;
        case 'trainer':
        case 'staff':
            // This now renders the REAL TrainerDashboard
            return <TrainerDashboard />;
        case 'client':
             // This now renders the REAL ClientDashboard
            return <ClientDashboard />; 
        default:
            return (
                <div className="text-red-400 flex flex-col items-center">
                    <Frown className="w-12 h-12" />
                    <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
                    <p>Your user role is not recognized.</p>
                </div>
            );
    }
};

export default AdminHome;

