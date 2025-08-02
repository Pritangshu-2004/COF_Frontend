import React, { createContext, useState, useCallback } from 'react';

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('Failed to fetch projects');
    }
    setLoading(false);
  }, []);

  const deleteProject = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}/api/projects?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.Id !== id));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  // New function to update project fields
  const updateProject = async (id, updates) => {
    try {
      console.log('updateProject called with:', id, updates);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}/api/projects`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      console.log('updateProject response status:', response.status);
      if (response.ok) {
        // Instead of local update, fetch fresh data from backend
        await fetchProjects();
        return true;
      } else {
        const errorText = await response.text();
        console.error('updateProject failed:', response.status, errorText);
        return false;
      }
    } catch (err) {
      console.error('updateProject error:', err);
      return false;
    }
  };

  return (
    <ProjectsContext.Provider value={{ projects, setProjects, loading, error, fetchProjects, deleteProject, updateProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};
