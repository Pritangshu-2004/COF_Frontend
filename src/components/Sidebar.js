import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUser,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const Sidebar = ({ user, onLogout, isSidebarOpen, toggleSidebar }) => {
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { id: 'client-form', label: 'Clients', icon: <FiUser />, path: '/client-form' },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 />, path: '/analytics' },
  ];

  return (
    <>
      
      {/* Overlay backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 max-w-full bg-gradient-to-b bg-[#EA7125] text-gray-100 flex flex-col z-50 shadow-lg
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b bg-white flex justify-center overflow-hidden">
          <img src="/assets/logo.png" alt="Sequoia Print Logo" className="w-36 sm:w-48 max-w-full object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 sm:p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setActiveHover(item.id)}
              onMouseLeave={() => setActiveHover(null)}
            >
              <Link
                to={item.path}
                className={`relative flex items-center w-full rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-left transition-colors duration-200
                  ${location.pathname === item.path
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'hover:bg-white/10 text-white/90'
                  }`}
              >
                {/* Active indicator */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-white transition-opacity duration-200 
                  ${location.pathname === item.path ? 'opacity-100' : 'opacity-0'}`}
                ></div>

                {/* Icon */}
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <div
                    className={`text-lg transition-transform duration-200
                    ${location.pathname === item.path ? 'scale-110' : ''}
                    ${activeHover === item.id ? 'scale-105' : ''}`}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Label */}
                <span className={`text-sm ${location.pathname === item.path ? 'font-medium' : 'font-normal'}`}>
                  {item.label}
                </span>

                {/* Hover effect */}
                {activeHover === item.id && location.pathname !== item.path && (
                  <div className="absolute inset-0 bg-white/5 rounded-lg pointer-events-none"></div>
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-3 sm:p-4 border-t bg-[#EA7125] flex flex-col items-center space-y-2 sm:space-y-3">
          {user && (
            <>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full justify-center">
                <button
                  onClick={() => alert('Support clicked')}
                  className="flex items-center justify-center px-2 py-1 sm:py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 10v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v-4m0 0l-2 2m2-2l2 2" />
                  </svg>
                  Support
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center px-2 py-1 sm:py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8v8" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;