import React, { createContext, useContext, useState } from 'react';
import { ChevronFirst, ChevronLast, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UseAuth from '../hook/UseAuth'; // Your auth hook

// Using Lucide icons to match the new design
import {
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Package,
  Receipt,
  Settings,
  Users,
  HeartPulse,
  Dumbbell
} from 'lucide-react';

// Create a context to share the expanded state
const SidebarContext = createContext();

// 1. Your exact role permissions object
const rolePermissions = {
  admin: ["Dashboard", "Appointments", "Services", "profile manage", "Settings", "Payments", "Clients"],
  staff: ["Dashboard", "Services","salary","Notice"],
  manager: ["Dashboard", "Appointments", "Users", "Settings"],
  client: ["Dashboard", "Class List", "Payments"],
  trainer: ["Dashboard", "Appointments", "Payments", "Nutrition", "WorkoutPlans", "Clients"],
};

// 2. Your menu items, mapped to the new icons and design
const sidebarItemsList = [
  { icon: <LayoutDashboard size={20} />, text: "Dashboard", to: "/admin" },
  { icon: <CalendarDays size={20} />, text: "Class List", to: "/admin/myClassList" },
  { icon: <Package size={20} />, text: "Services", to: "/services" },
  { icon: <UserCircle size={20} />, text: "profile manage", to: "/admin/getAllStaff" },
  { icon: <Receipt size={20} />, text: "Payments", to: "/admin/payment-history" },
  { icon: <HeartPulse size={20} />, text: "Nutrition", to: "/admin/nutrion-plan" },
  { icon: <Dumbbell size={20} />, text: "WorkoutPlans", to: "/admin/workout-plan" },
  { icon: <Users size={20} />, text: "Clients", to: "/clients" },
  { icon: <Settings size={20} />, text: "Settings", to: "/settings" },
];


const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const { logOutUser, isAuthenticated, user } = UseAuth();
  const navigate = useNavigate();

  // Your hasAccess function - no changes needed
  const hasAccess = (permission) => {
    if (!isAuthenticated) return false;
    const userRole = user?.role || 'user'; // Safely handle undefined role
    return rolePermissions[userRole]?.includes(permission);
  };

  const handleLogout = () => {
    logOutUser()

    navigate('/login');


  };

  return (
    <aside className="h-screen sticky top-0">
      <nav className="h-full flex flex-col bg-gray-900 border-r border-gray-700 shadow-sm">
        {/* Header: Logo and Toggle Button */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://placehold.co/128x40/f8fafc/111827?text=Logo&font=raleway"
            className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}
            alt="Company Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {sidebarItemsList.map((item, index) => (
              // This logic now correctly shows YOUR menu items based on role
              hasAccess(item.text) && (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  to={item.to}
                />
              )
            ))}
          </ul>
        </SidebarContext.Provider>

        {/* User Profile Section */}
        <div className="border-t border-gray-700 flex p-3">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=c7d2fe&color=3730a3&bold=true`}
            alt="User Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">{user?.displayName || 'Guest User'}</h4>
              <span className="text-xs text-gray-400">{user?.email || ''}</span>
            </div>
            <button onClick={handleLogout} className="hover:text-red-500 text-gray-400">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

// Sub-component for individual sidebar items (The design you liked)
function SidebarItem({ icon, text, to }) {
  const { expanded } = useContext(SidebarContext);
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to}>
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${active
            ? 'bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white'
            : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
          }
      `}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}>
          {text}
        </span>

        {!expanded && (
          <div
            className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-800 text-white text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}

export default Sidebar;