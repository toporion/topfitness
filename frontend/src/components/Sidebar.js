import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect 
} from 'react';
import { 
  ChevronFirst, 
  ChevronLast, 
  LogOut, 
  ChevronDown,
  PlusCircle, // Added for the new sub-dropdown
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UseAuth from '../hook/UseAuth'; // Your auth hook

// Using Lucide icons
import {
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Package,
  Receipt,
  Settings,
  Users,
  HeartPulse, // Kept for "Nutrition" icon
  Dumbbell
} from 'lucide-react';

import logo from '../assets/final.png'

// Create a context
const SidebarContext = createContext();

// 1. MODIFIED rolePermissions
const rolePermissions = {
  admin: ["Dashboard", "Appointments", "Services", "profile manage", "Settings", "Payments", "Clients"],
  staff: ["Dashboard", "Services","salary","Notice"],
  manager: ["Dashboard", "Appointments", "Users", "Settings"],
  client: ["Dashboard", "Class List", "Payments"],
  trainer: [
    "Dashboard",
    "Payments", 
    "Nutrition", 
    "WorkoutPlans", 
    "Clients",
    "Add Class", // This permission now controls the "Add Class" PARENT dropdown
    "Create New Class", // New permission for the child
    "Manage Classes"    // New permission for the child
  ],
};

// 2. MODIFIED sidebarItemsList
const sidebarItemsList = [
  { icon: <LayoutDashboard size={20} />, text: "Dashboard", to: "/admin" },
  { icon: <CalendarDays size={20} />, text: "Class List", to: "/admin/myClassList" },
  { icon: <Package size={20} />, text: "Services", to: "/services" },
  { icon: <UserCircle size={20} />, text: "profile manage", to: "/admin/getAllStaff" },
  { icon: <Receipt size={20} />, text: "Payments", to: "/admin/payment-history" },
  
  // --- PARENT DROPDOWN ITEM ---
  { 
    icon: <Dumbbell size={20} />, 
    text: "Trainer Tools", 
    children: [
      // --- NESTED DROPDOWN ITEM ---
      { 
        icon: <PlusCircle size={20} />, // Icon for the "Add Class" dropdown
        text: "Add Class", 
        children: [
          { text: "Create New Class", to: "/admin/add-class" }, // Placeholder
          { text: "Manage Classes", to: "/admin/trainer-classes" }, // Placeholder
        ]
      },
      // --- END OF NESTED ITEM ---
      { text: "Nutrition", to: "/admin/nutrion-plan" },
      { text: "WorkoutPlans", to: "/admin/workout-plan" },
    ] 
  },
  // --- END OF PARENT DROPDOWN ITEM ---

  { icon: <Users size={20} />, text: "Clients", to: "/clients" },
  { icon: <Settings size={20} />, text: "Settings", to: "/settings" },
];


const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const { logOutUser, isAuthenticated, user } = UseAuth();
  const navigate = useNavigate();

  // Your hasAccess function
  const hasAccess = (permission) => {
    if (!isAuthenticated) return false;
    const userRole = user?.role || 'user';
    return rolePermissions[userRole]?.includes(permission);
  };

  const handleLogout = () => {
    logOutUser();
    navigate('/login');
  };

  return (
    <aside className="h-screen sticky top-0">
      <nav className="h-full flex flex-col bg-gray-900 border-r border-gray-700 shadow-sm">
        {/* Header: Logo and Toggle Button */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={logo}
            className={`overflow-hidden transition-all ${expanded ? 'w-28' : 'w-0'}`}
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
            {/* MODIFIED MAPPING LOGIC */}
            {sidebarItemsList.map((item, index) => {
              // Check if user has permission for the item
              // For dropdowns, check if they have permission for ANY child
              const canAccess = item.children
                ? item.children.some(child => hasAccess(child.text))
                : hasAccess(item.text);

              // If it's a dropdown, pass all children
              if (item.children && canAccess) {
                 return (
                  <SidebarItem
                    key={index}
                    icon={item.icon}
                    text={item.text}
                    children={item.children}
                  />
                );
              }
              
              // If it's a single item
              if (!item.children && canAccess) {
                return (
                  <SidebarItem
                    key={index}
                    icon={item.icon}
                    text={item.text}
                    to={item.to}
                  />
                );
              }
              
              return null;
            })}
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
              <h4 className="font-semibold text-white">{user?.name || 'Guest User'}</h4>
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

// --- RECURSIVE & UPGRADED SidebarItem COMPONENT ---
function SidebarItem({ icon, text, to, children }) {
  const { expanded } = useContext(SidebarContext);
  const location = useLocation();
  const { isAuthenticated, user } = UseAuth(); 
  
  const [open, setOpen] = useState(false);
  const isDropdown = children && children.length > 0;

  // Check if any child link is the active page
  const hasActiveChild = isDropdown
    ? children.some(child => location.pathname === child.to)
    : false;

  const active = (to && location.pathname === to) || hasActiveChild;

  // Auto-open dropdown if a child is active
  useEffect(() => {
    if (hasActiveChild) {
      setOpen(true);
    }
  }, [hasActiveChild]);

  // Local hasAccess function
  const hasAccess = (permission) => {
    if (!isAuthenticated) return false;
    const userRole = user?.role || 'user';
    return rolePermissions[userRole]?.includes(permission);
  };


  // --- RENDER DROPDOWN (Can be parent or nested) ---
  if (isDropdown) {
    return (
      <li
        className={`
          relative flex flex-col
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${active
            ? 'bg-gray-800 text-gray-200'
            : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
          }
        `}
      >
        {/* Clickable header for the dropdown */}
        <div
          className="flex items-center justify-between py-2 px-3 my-1"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center">
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? 'w-44 ml-3' : 'w-0'}`}>
              {text}
            </span>
          </div>
          {/* Dropdown Arrow */}
          {expanded && (
            <ChevronDown
              size={16}
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
            />
          )}
        </div>

        {/* --- RECURSIVE SUB-ITEMS LIST --- */}
        {open && expanded && (
          // This styling adds the indentation for nested lists
          <ul className="pl-9 pr-3 pb-2"> 
            {children.map((child, index) => (
              // Check permission for the child
              hasAccess(child.text) && (
                child.children ? (
                  // --- RECURSIVE CALL ---
                  // If the child is ALSO a dropdown, render SidebarItem again
                  <SidebarItem
                    key={index}
                    icon={child.icon}
                    text={child.text}
                    children={child.children}
                  />
                ) : (
                  // --- RENDER SIMPLE LINK ---
                  <li
                    key={index}
                    className={`
                      relative flex items-center
                      font-medium rounded-md cursor-pointer
                      transition-colors group text-sm
                      ${location.pathname === child.to
                        ? 'text-white' // Active simple link
                        : 'text-gray-400 hover:text-gray-200'
                      }
                    `}
                  >
                    <Link 
                      to={child.to} 
                      className={`
                        flex items-center w-full py-1.5 px-3 my-0.5 rounded-md
                        ${location.pathname === child.to
                          ? 'bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white'
                          : 'hover:bg-gray-700'
                        }
                      `}
                    >
                      <span className="w-2 h-2 mr-2 bg-gray-500 rounded-full group-hover:bg-indigo-300 transition-colors"></span>
                      <span>{child.text}</span>
                    </Link>
                  </li>
                )
              )
            ))}
          </ul>
        )}
        {/* --- END OF RECURSIVE LIST --- */}

        {/* Tooltip for collapsed dropdown parent */}
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
    );
  }

  // --- RENDER SINGLE LINK (e.g., Dashboard) ---
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