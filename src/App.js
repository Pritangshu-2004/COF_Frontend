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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
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
