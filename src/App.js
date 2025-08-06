import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ClientForm from './components/ClientForm';
import Analytics from './components/Analytics';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import ProjectDetails from './components/ProjectDetails';
import { ProjectsProvider } from './contexts/ProjectsContext';
import TopNavbar from './components/TopNavbar';
import * as Protected from './utils/protected';
import { FiMenu, FiX } from 'react-icons/fi';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Protected module:', Protected);
    const storedUser = localStorage.getItem('user');
    if (storedUser && Protected.isAuthenticated()) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    Protected.removeToken();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ProjectsProvider>
      {/* Hamburger menu button for mobile */}
      <button
        className="fixed top-4 left-4 z-60 p-2 flex items-center rounded-md text-white bg-[#EA7125] lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        <span className="ml-2 text-base font-semibold block sm:hidden">Menu</span>
      </button>
      {/* Sidebar is fixed, so it's outside the flow */}
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {/* TopNavbar is fixed at the top */}
      <TopNavbar username={user?.name || user?.username || ''} />
      {/* Main content area */}
      <div className="pt-14 lg:ml-64 bg-gray-100 min-h-screen transition-all duration-300">
        <main className="p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/client-form" element={<ClientForm />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/project-details" element={<ProjectDetails />} />
          </Routes>
        </main>
      </div>
    </ProjectsProvider>
  );
}

export default App;
