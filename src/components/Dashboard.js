import React, { useState, useContext, useEffect } from "react";
import {
  FaPrint,
  FaUser,
  FaClock,
  FaPlus,
  FaFilter,
  FaSearch,
  FaEllipsisV,
  FaArrowUp,
  FaArrowDown,
  FaClipboardCheck,
  FaPalette,
  FaCogs,
  FaPencilAlt,
  FaThumbsUp,
  FaCalendarDay,
  FaTruck,
  FaSignOutAlt
} from "react-icons/fa";
import { FiActivity, FiCheckCircle, FiAlertCircle, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ProjectsContext } from '../contexts/ProjectsContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { projects, fetchProjects, loading, error, deleteProject } = useContext(ProjectsContext);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const statusColors = {
    'Approved': 'bg-green-100 text-green-800',
    'In Print': 'bg-blue-100 text-blue-800',
    'Proofing': 'bg-yellow-100 text-yellow-800',
    'Delayed': 'bg-red-100 text-red-800',
    'Briefed': 'bg-purple-100 text-purple-800',
    'Dispatched': 'bg-indigo-100 text-indigo-800',
    'Unknown': 'bg-gray-100 text-gray-800'
  };

  const filteredProjects = projects.filter(project => {
    const clientName = project.Name || '';
    const projectType = project.Project_type || '';
    const status = project.Status || '';
    const matchesSearch = clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projectType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || status.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const safeCharAt = (str, index) => (str && str.length > index ? str.charAt(index) : '');

  const StatCard = ({ title, value, change, icon, trend }) => {
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    const trendIcon = trend === 'up' ? <FaArrowUp className="text-xs" /> : trend === 'down' ? <FaArrowDown className="text-xs" /> : null;

    return (
      <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">{title}</p>
            <p className="mt-0.5 sm:mt-1 text-sm sm:text-lg md:text-xl text-gray-900">{value}</p>
          </div>
          <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-sm sm:text-lg">
            {icon}
          </div>
        </div>
        <div className={`mt-1 sm:mt-2 flex items-center text-[10px] sm:text-xs ${trendColor}`}>
          {trendIcon && <span className="mr-0.5 sm:mr-1">{trendIcon}</span>}
          <span>{change ? `${change} from last week` : ''}</span>
        </div>
      </div>
    );
  };

  const ProjectStatusCard = ({ project }) => {
    const clientName = project.Name || 'N/A';
    const projectType = project.Project_type || 'N/A';
    const status = project.Status || 'Unknown';
    const startDate = project.Start_date ? new Date(project.Start_date).toLocaleDateString() : '-';
    const dueDate = project.Due_date ? new Date(project.Due_date).toLocaleDateString() : '-';
    const completionDate = project.Completion_Date ? new Date(project.Completion_Date).toLocaleDateString() : '-';
    const progress = project.Progress || 0;

    const statusClass = statusColors[status] || statusColors['Unknown'];

    return (
      <div className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 bg-white">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm text-gray-900 truncate">{clientName}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-1 truncate">{projectType}</p>
        <p className="text-xs text-gray-500 mb-1">Start: {startDate}</p>
        <p className="text-xs text-gray-500 mb-2">Project Deadline: {dueDate}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
          <div
            className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
              progress < 50 ? 'bg-yellow-500' : progress < 90 ? 'bg-blue-500' : 'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-700 mt-1 font-medium">{progress}% Progress</p>
      </div>
    );
  };

  // Simulated stats from last week (replace with real backend data in production)
  const lastWeekStats = {
    totalProjects: 8,
    activeClients: 3,
    onTime: 6,
    delayed: 1,
  };

  // Calculate current stats
  const totalProjects = projects.length;
  const activeClients = (() => {
    const uniqueClients = new Set(projects.map(p => p.Name || p.client || ''));
    return uniqueClients.size;
  })();
  const onTimeStatuses = ['Approved', 'In Print', 'Proofing', 'Briefed', 'Dispatched'];
  const onTime = projects.filter(p => onTimeStatuses.includes(p.Status)).length;
  const delayed = projects.filter(p => p.Status === 'Delayed').length;

  // Calculate changes from last week
  const totalProjectsChange = totalProjects - lastWeekStats.totalProjects;
  const activeClientsChange = activeClients - lastWeekStats.activeClients;
  const onTimeChange = onTime - lastWeekStats.onTime;
  const delayedChange = delayed - lastWeekStats.delayed;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchProjects}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Group projects by client name
  const groupedProjects = filteredProjects.reduce((acc, project) => {
    const client = project.Name || '';
    if (!acc[client]) acc[client] = [];
    acc[client].push(project);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6">
      {/* Header Section */}  
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 truncate">Sequoia Print Dashboard</h1>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs md:text-sm text-gray-600 max-w-md truncate">
            Overview of your print projects and activities
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/client-form')}
            className="w-full md:w-auto flex items-center justify-center gap-1 sm:gap-2 bg-[#EA7125] hover:bg-[#D96520] text-white px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 rounded-lg shadow hover:shadow-md active:scale-[0.98] transition-all duration-150 text-xs sm:text-sm md:text-base"
          >
            <FaPlus className="text-xs sm:text-sm md:text-base" /> 
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          change={`${totalProjectsChange >= 0 ? '+' : ''}${totalProjectsChange}`}
          icon={<FiActivity className="text-orange-500" />}
          trend={totalProjectsChange > 0 ? 'up' : totalProjectsChange < 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="Active Clients"
          value={activeClients}
          change={`${activeClientsChange >= 0 ? '+' : ''}${activeClientsChange}`}
          icon={<FaUser className="text-blue-500" />}
          trend={activeClientsChange > 0 ? 'up' : activeClientsChange < 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="On Time"
          value={onTime}
          change={`${onTimeChange >= 0 ? '+' : ''}${onTimeChange}`}
          icon={<FiCheckCircle className="text-green-500" />}
          trend={onTimeChange > 0 ? 'up' : onTimeChange < 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="Delayed"
          value={delayed}
          change={`${delayedChange >= 0 ? '+' : ''}${delayedChange}`}
          icon={<FiAlertCircle className="text-red-500" />}
          trend={delayedChange > 0 ? 'up' : delayedChange < 0 ? 'down' : 'neutral'}
        />
      </div>

      {/* Project Status Overview */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md border border-gray-200 overflow-hidden mb-3 sm:mb-4 md:mb-6">
        <div className="p-2 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 md:mb-4 gap-1 sm:gap-2 md:gap-4">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800">Project Status</h2>
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">
              Showing {projects.length} active projects
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            {projects.slice(0, 4).map((project, index) => (
              <ProjectStatusCard key={index} project={project} />
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md border border-gray-200 overflow-hidden">
        <div className="p-2 sm:p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 sm:mb-3 md:mb-4 gap-2 sm:gap-3 md:gap-4">
            <div>
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800">Active Projects</h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">All ongoing client projects</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-1.5 sm:gap-2 md:gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400 text-xs sm:text-sm" />
                </div>
                <input
                  type="text"
                  placeholder={window.innerWidth >= 640 ? "Search projects..." : "Search..."}
                  className="pl-7 sm:pl-9 md:pl-10 w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:ring-1 sm:focus:ring-2 focus:ring-orange-300 outline-none text-xs sm:text-sm md:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-1.5 sm:gap-2 md:gap-3">
                <div className="relative flex-grow hidden sm:block">
                  <select
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:ring-1 sm:focus:ring-2 focus:ring-orange-300 outline-none text-xs sm:text-sm md:text-base appearance-none"
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="print">In Print</option>
                    <option value="proofing">In Proofing</option>
                    <option value="approved">Approved</option>
                    <option value="briefed">Briefed</option>
                    <option value="dispatched">Dispatched</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <button 
                  className="p-1.5 sm:p-2 md:p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                  <FaFilter className="text-gray-600 text-xs sm:text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Dropdown */}
          {isMobileFilterOpen && (
            <div className="mb-2 sm:hidden">
              <select
                className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-orange-300 outline-none text-xs"
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setIsMobileFilterOpen(false);
                }}
              >
                <option value="all">All Status</option>
                <option value="print">In Print</option>
                <option value="proofing">In Proofing</option>
                <option value="approved">Approved</option>
                <option value="briefed">Briefed</option>
                <option value="dispatched">Dispatched</option>
              </select>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 text-left text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 text-left text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 text-left text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="hidden md:table-cell px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 text-left text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th scope="col" className="px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 text-left text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 text-right text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(groupedProjects).map(([client, projects]) =>
                  projects.map((project, idx) => (
                    <tr key={project.Id || project._id || idx} className="hover:bg-gray-50 transition-colors">
                      {/* Client Name cell: only for the first project, with rowSpan */}
                      {idx === 0 && (
                        <td
                          className="px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 whitespace-nowrap align-top"
                          rowSpan={projects.length}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-base sm:text-lg">
                              {safeCharAt(client, 0)}
                            </div>
                            <div className="ml-3 sm:ml-4 md:ml-6">
                              <div className="text-sm sm:text-base md:text-lg text-gray-900 truncate max-w-[120px] sm:max-w-none">
                                {client}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] sm:max-w-none">
                                {/* Optionally show something else here */}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      {/* Project column */}
                      <td className="px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 whitespace-nowrap">
                        <div className="text-sm sm:text-base md:text-lg text-gray-900 truncate max-w-[120px] sm:max-w-none">
                          {project.project || project.Project_type || 'N/A'}
                        </div>
                      </td>
                      {/* Status column */}
                      <td className="hidden sm:table-cell px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.Status ? statusColors[project.Status] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.Status || 'Unknown'}
                        </span>
                      </td>
                      {/* Timeline column */}
                      <td className="hidden md:table-cell px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 whitespace-nowrap">
                        <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                          <div>{project.Start_date ? new Date(project.Start_date).toLocaleDateString() : '-'} - {project.Completion_Date ? new Date(project.Completion_Date).toLocaleDateString() : '-'}</div>
                          <div className="flex items-center text-[10px] sm:text-xs mt-0.5">
                            <FiClock className="mr-0.5 sm:mr-1" />
                            {project.Priority === 'high' ? 'Urgent' :
                              project.Priority === 'medium' ? 'Standard' : 'Low priority'}
                          </div>
                          <div className="text-[10px] sm:text-xs mt-0.5">
                            Current Stage: {project.Current_stage || 'N/A'}
                          </div>
                        </div>
                      </td>
                      {/* Progress column */}
                      <td className="px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 sm:w-20 md:w-full mr-1 sm:mr-2 rounded-full overflow-hidden shadow-md">
                            <div className="w-full bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 rounded-full h-1 sm:h-1.5 md:h-2 transition-all duration-500 ease-in-out">
                              <div
                                className={`h-1 sm:h-1.5 md:h-2 rounded-full ${
                                project.Progress < 50 ? 'bg-yellow-500' :
                                project.Progress < 90 ? 'bg-blue-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${project.Progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm md:text-base text-gray-700">
                            {project.Progress}%
                          </span>
                        </div>
                      </td>
                      {/* Actions column */}
                      <td className="px-1 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 whitespace-nowrap text-right text-xs sm:text-sm md:text-base font-medium flex justify-end gap-2">
                        <button
                          className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                          onClick={() => navigate('/project-details', {
                            state: {
                              project: {
                                ...project,
                                timeline: project.timeline ? project.timeline.map(({ stage }) => ({ stage })) : []
                              }
                            }
                          })}
                          title="View Details"
                        >
                          <FaEllipsisV className="text-xs sm:text-sm md:text-base" />
                        </button>
                        <button
                          className="group relative flex items-center justify-center p-2 rounded-full bg-red-50 hover:bg-[#EA7125] transition-all duration-200 border border-transparent hover:border-[#EA7125] focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-90"
                          title="Delete Project"
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete project "${project.Name}"?`)) {
                              const success = await deleteProject(project.Id);
                              if (success) {
                                alert('Project deleted successfully');
                              } else {
                                alert('Failed to delete project');
                              }
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-[#EA7125] text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            Delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;