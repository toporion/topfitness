import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Outlet } from 'react-router-dom';
  

const Dashboard = () => {
    return (
        // Changed main background to a dark gray
        <div className="flex bg-gray-900 min-h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <TopBar />

                <main className="flex-1 p-6">
                    {/* Changed text colors to be light */}
                    <h1 className="text-3xl font-bold text-gray-100">Welcome, John!</h1>
                    <p className="mt-2 text-gray-400">Here's what's happening today.</p>

                    {/* Example content card styled for a dark theme */}
                    <div className="mt-8">
                        <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                          
                           
                              <Outlet/>     
                        </div>
                     
                    </div>
                    
                </main>
            </div>
        </div>
    );
};

export default Dashboard;