import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowRight,
  FaFileAlt,
  FaComments,
  FaCalendarAlt,
  FaArrowLeft,
  FaPrint,
  FaCheckCircle,
  FaTruck,
  FaBox,
  FaClipboardCheck,
  FaHandshake,
  FaPencilAlt,
  FaPalette,
  FaCogs,
  FaThumbsUp,
  FaCalendarDay,
  FaSignOutAlt,
  FaUser,
  FaPlus,
  FaTimes,
  FaLink
} from 'react-icons/fa';
import { FiAlertTriangle, FiClock } from 'react-icons/fi';
import { ProjectsContext } from '../contexts/ProjectsContext';

const ProjectDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { projects, fetchProjects, updateProject } = useContext(ProjectsContext);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  const stageIcons = {
    "Client Introduction / Onboarding": <FaUser className="mr-2" />,
    "Briefing & Requirement Gathering": <FaClipboardCheck className="mr-2" />,
    "Artwork Submission": <FaPalette className="mr-2" />,
    "Prepress": <FaCogs className="mr-2" />,
    "Proofing": <FaPencilAlt className="mr-2" />,
    "Artwork Approval": <FaThumbsUp className="mr-2" />,
    "Plate Making": <FaCogs className="mr-2" />,
    "Print Scheduling": <FaCalendarDay className="mr-2" />,
    "Printing": <FaPrint className="mr-2" />,
    "Post-Press (If Applicable)": <FaCogs className="mr-2" />,
    "Packing & Dispatch": <FaTruck className="mr-2" />,
    "Closure & Feedback": <FaSignOutAlt className="mr-2" />
  };

  const [project, setProject] = useState(null);

  const defaultProject = {
    timeline: [
      { stage: "Client Introduction / Onboarding" },
      { stage: "Briefing & Requirement Gathering" },
      { stage: "Artwork Submission" },
      { stage: "Prepress" },
      { stage: "Proofing" },
      { stage: "Artwork Approval" },
      { stage: "Plate Making" },
      { stage: "Print Scheduling" },
      { stage: "Printing" },
      { stage: "Post-Press (If Applicable)" },
      { stage: "Packing & Dispatch" },
      { stage: "Closure & Feedback" }
    ]
  };

  // State to track completed stages
  const [completedStages, setCompletedStages] = useState([]);

  // State for modals and forms
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [showAddCommModal, setShowAddCommModal] = useState(false);
  const [newFile, setNewFile] = useState({
    name: '',
    link: '',
    note: '',
    type: 'pdf'
  });
  const [newCommunication, setNewCommunication] = useState({
    note: '',
    type: 'email',
    date: new Date().toLocaleDateString()
  });
  const [files, setFiles] = useState([]);
  const [communications, setCommunications] = useState([]);

  // Ensure timeline and currentStage are defined and valid
  const timeline = project?.timeline || defaultProject.timeline;
  // Default currentStage to 1 if invalid or missing
  const currentStage = (project && typeof project.currentStage === 'number' && project.currentStage >= 1 && project.currentStage <= timeline.length) ? project.currentStage : 1;

  // Fetch latest project data by ID for real-time updates
  useEffect(() => {
    async function fetchProjectAndRelated() {
      try {
        const projectId = params.id || state?.project?.Id || state?.project?.id;
        if (!projectId) return;
        // Fetch project details
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/projects?id=${projectId}`);
        let mappedProject = null;
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const raw = data[0];
            mappedProject = {
              ...raw,
              id: raw.Id,
              currentStage: raw.Current_stage ?? 1,
              progress: raw.Progress ?? 0,
              status: raw.Status ?? '',
              priority: raw.Priority ?? '',
              client: raw.Name ?? '',
              project: raw.Project_type ?? '',
              startDate: raw.Start_date ? new Date(raw.Start_date).toLocaleDateString() : '',
              completion: raw.Completion_Date ? new Date(raw.Completion_Date).toLocaleDateString() : '',
              notes: raw.Notes ?? '',
              timeline: raw.timeline || defaultProject.timeline,
            };
            setProject(mappedProject);
            setCompletedStages(
              Array((mappedProject.timeline || defaultProject.timeline).length).fill(false).map((_, i) => i < mappedProject.currentStage)
            );
          }
        } else {
          console.error('Failed to fetch project details');
        }
        // Fetch files
        const filesRes = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/files?projectId=${projectId}`);
        if (filesRes.ok) {
          const filesData = await filesRes.json();
          setFiles(filesData.map(f => ({
            id: f.Id,
            name: f.Name,
            link: f.URL_Link,
            note: f.Notes,
            type: f.Type,
            date: f.Uploaded_at ? new Date(f.Uploaded_at).toLocaleDateString() : '',
          })));
        }
        // Fetch communications
        const commRes = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/communications?projectId=${projectId}`);
        if (commRes.ok) {
          const commData = await commRes.json();
          setCommunications(commData.map(c => ({
            id: c.Id,
            note: c.Notes,
            type: c.Type,
            date: c.Date ? new Date(c.Date).toLocaleDateString() : '',
          })));
        }
      } catch (error) {
        console.error('Error fetching project details or related data:', error);
      }
    }
    fetchProjectAndRelated();
  }, [params, state]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Find the first incomplete stage index
  let firstIncompleteStageIndex = completedStages.findIndex(completed => !completed);
  const allStagesCompleted = firstIncompleteStageIndex === -1;

  const handleStageChange = async (stageIndex) => {
    try {
      // Create new completed stages array
      const newCompletedStages = [...completedStages];
      newCompletedStages[stageIndex] = true;

      // Calculate new current stage (stageIndex + 1 since stages are 1-indexed)
      const newCurrentStage = stageIndex + 1;
      const newProgress = Math.round((newCurrentStage / timeline.length) * 100);
      const projectId = project.Id || project.id;

      // Get new status from mapping
      const newStatus = stageToStatus[newCurrentStage - 1] || project.status;

      if (!projectId) {
        alert('Invalid project ID. Cannot update project stage.');
        return;
      }

      console.log('Updating project stage:', {
        projectId,
        Current_stage: newCurrentStage,
        Progress: newProgress,
        Status: newStatus,
      });

      // Update backend and context with status
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Current_stage: newCurrentStage,
          Progress: newProgress,
          Status: newStatus,
        }),
      });

      const result = await response.json();

      if (response.ok && result.message === 'Project updated successfully') {
        // Update local state
        setProject(prev => ({
          ...prev,
          currentStage: newCurrentStage,
          progress: newProgress,
          status: newStatus,
        }));
        
        setCompletedStages(
          Array(timeline.length).fill(false).map((_, i) => i < newCurrentStage)
        );

        // Refresh projects list
        await fetchProjects();
        
        console.log('Successfully updated project stage to:', newCurrentStage);
      } else {
        console.error('Failed to update project:', result.message || 'Unknown error');
        alert(`Failed to update project stage: ${result.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error updating project stage:', error);
      alert('Failed to update project stage. Please check your connection and try again.');
    }
  };

  // File handling functions
  const handleAddFile = async () => {
    if (!newFile.name) return;
    const projectId = params.id || state?.project?.Id || state?.project?.id;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: newFile.name,
          link: newFile.link,
          note: newFile.note,
          type: newFile.type,
        })
      });
      if (res.ok) {
        // Re-fetch files after successful add
        const filesRes = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/files?projectId=${projectId}`);
        if (filesRes.ok) {
          const filesData = await filesRes.json();
          setFiles(filesData.map(f => ({
            id: f.Id,
            name: f.Name,
            link: f.Link,
            note: f.Note,
            type: f.Type,
            date: f.Uploaded_at ? new Date(f.Uploaded_at).toLocaleDateString() : '',
          })));
        }
      }
    } catch (err) {
      console.error('Error adding file:', err);
    }
    setNewFile({ name: '', link: '', note: '', type: 'pdf' });
    setShowAddFileModal(false);
  };

  const handleAddCommunication = async () => {
    if (!newCommunication.note) return;
    const projectId = params.id || state?.project?.Id || state?.project?.id;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/communications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: newCommunication.type,
          note: newCommunication.note,
          date: newCommunication.date,
        })
      });
      if (res.ok) {
        // Re-fetch communications after successful add
        const commRes = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/communications?projectId=${projectId}`);
        if (commRes.ok) {
          const commData = await commRes.json();
          setCommunications(commData.map(c => ({
            id: c.Id,
            note: c.Notes,
            type: c.Type,
            date: c.Created_at ? new Date(c.Created_at).toLocaleDateString() : '',
          })));
        }
      }
    } catch (err) {
      console.error('Error adding communication:', err);
    }
    setNewCommunication({ note: '', type: 'email', date: new Date().toLocaleDateString() });
    setShowAddCommModal(false);
  };

  // Status badge colors to match Dashboard.js
  const statusBadgeColors = {
    'Briefed': 'bg-blue-100 text-blue-800',
    'Approved': 'bg-green-100 text-green-800',
    'In Print': 'bg-orange-100 text-orange-800',
    'In Proofing': 'bg-yellow-100 text-yellow-800',
    'Dispatched': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-orange-100 text-orange-800'
  };

  // Priority badge colors
  const priorityBadgeColors = {
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-blue-100 text-blue-800'
  };

  

  // Mapping of stages to statuses
  const stageToStatus = [
    'briefed',         // 1: Client Introduction / Onboarding
    'briefed',         // 2: Briefing & Requirement Gathering
    'briefed',         // 3: Artwork Submission
    'proofing',        // 4: Prepress
    'proofing',        // 5: Proofing
    'approved',        // 6: Artwork Approval
    'print',           // 7: Plate Making
    'print',           // 8: Print Scheduling
    'print',           // 9: Printing
    'print',           // 10: Post-Press (If Applicable)
    'dispatched',      // 11: Packing & Dispatch
    'dispatched',      // 12: Closure & Feedback
  ];

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100 text-center text-gray-500">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header Section with Back Button */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors mb-6"
        >
          <FaArrowLeft className="text-lg" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-2xl text-gray-700 mb-1 truncate">Project Details</h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 truncate">
              {project.project || project.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <p className="text-base sm:text-lg text-gray-700 font-medium truncate max-w-full">{project.client || project.email}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusBadgeColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                  {project.status}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${priorityBadgeColors[project.priority] || 'bg-gray-100 text-gray-800'}`}>
                  {project.priority === 'high' ? 'High Priority' :
                    project.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                </div>
              </div>
            </div>
          </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
              <div className="flex items-center text-gray-500 bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base whitespace-nowrap">
                <FaCalendarAlt className="mr-2 text-orange-500" />
                <span>Start: {project.startDate}</span>
              </div>
              <div className="flex items-center text-gray-500 bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base whitespace-nowrap">
                <FaCalendarAlt className="mr-2 text-orange-500" />
                <span>Project Deadline: {project.Due_date ? new Date(project.Due_date).toLocaleDateString() : '-'}</span>
              </div>
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between text-sm sm:text-base text-gray-600 mb-1">
          <span>Project Progress</span>
          <span>{project.progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div
            className={`h-2 sm:h-3 rounded-full ${project.progress < 50 ? 'bg-yellow-500' :
                project.progress < 90 ? 'bg-blue-500' : 'bg-green-500'
              }`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Stage */}
      <div className="mb-8 sm:mb-10 bg-gradient-to-r from-orange-50 to-orange-100 p-4 sm:p-6 rounded-2xl border border-orange-200 shadow-inner">
        <h3 className="text-lg sm:text-xl mb-4 text-orange-900">Current Stage</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-orange-200 flex-shrink-0">
            {timeline[currentStage - 1]?.icon || stageIcons[timeline[currentStage - 1]?.stage] || <FaClipboardCheck className="text-orange-500 text-2xl" />}
          </div>
          <div>
            <h4 className="text-xl sm:text-2xl text-orange-900 truncate max-w-xs">
              {timeline[currentStage - 1]?.stage || "Not Started"}
            </h4>
            <p className="text-orange-700 mt-1 max-w-xs truncate">
              {project.nextAction || "No action currently required"}
            </p>
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="mb-8 sm:mb-10">
        <h3 className="text-lg sm:text-xl mb-6 text-gray-900">Project Timeline</h3>
        <div className="space-y-4">
          {timeline.map((stage, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center mt-1 sm:mt-0 ${completedStages[index] ? 'bg-green-100 text-green-600' :
                  index === currentStage - 1 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                }`}>
                {completedStages[index] ? (
                  <FaCheckCircle className="text-base sm:text-lg" />
                ) : (
                  <span className="font-medium text-sm sm:text-base">{index + 1}</span>
                )}
              </div>
              <div className={`flex-1 pb-4 ${index < timeline.length - 1 ? 'border-l-2 border-dashed border-gray-200' : ''
                }`}>
                <div className={`p-3 sm:p-4 rounded-lg ${completedStages[index] ? 'bg-green-50 border border-green-100' :
                    index === currentStage - 1 ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50 border border-gray-100'
                  }`}>
                  <h4 className={`font-medium ${completedStages[index] ? 'text-green-800' :
                      index === currentStage - 1 ? 'text-orange-800' : 'text-gray-700'
                    } truncate max-w-full`}>
                    {stage.stage}
                  </h4>
                  {(!allStagesCompleted && index === firstIncompleteStageIndex) && (
                  <button
                  onClick={() => {
                  console.log('Mark as Complete button clicked for stage:', index);
                  handleStageChange(index);
                  }}
                  className="mt-3 text-xs sm:text-sm px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                  Mark as Complete
                  </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Files and Communication Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-10">
        {/* Files Section */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 text-gray-900">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaFileAlt className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-lg sm:text-xl">Files & Documents</h3>
            </div>
            <button
              onClick={() => setShowAddFileModal(true)}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <FaPlus /> Add File
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="p-4 sm:p-5 bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className=" text-gray-900 group-hover:text-orange-600 transition-colors truncate text-lg">
                      {file.name}
                    </p>
                    {file.note && (
                      <p className="text-sm text-gray-700 mt-1">
                        {file.note}
                      </p>
                    )}
                    {file.date && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <FiClock className="mr-2 text-orange-500" />
                        {file.date}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <span className="text-xs font-medium px-3 py-1 bg-orange-100 text-orange-800 rounded-full uppercase tracking-wide">
                      {file.type || 'file'}
                    </span>
                    {file.link && (
                      <a 
                        href={file.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        title="Open file link"
                      >
                        <FaLink className="mr-1" /> Open Link
                      </a>
                    )}
                    <button
                      onClick={async () => {
                        if (!window.confirm('Are you sure you want to delete this file?')) return;
                        try {
                          const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/files/${file.id}`, {
                            method: 'DELETE',
                          });
                          if (res.ok) {
                            setFiles(files.filter((_, i) => i !== index));
                          } else {
                            alert('Failed to delete file');
                          }
                        } catch (err) {
                          console.error('Error deleting file:', err);
                          alert('Error deleting file');
                        }
                      }}
                      className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                      title="Delete file"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {files.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No files added yet
              </div>
            )}
          </div>
        </div>

        {/* Communication Log */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 text-gray-900">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaComments className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-lg sm:text-xl">Communication Log</h3>
            </div>
            <button
              onClick={() => setShowAddCommModal(true)}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <FaPlus /> Add Log
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {communications.map((comm, index) => (
              <div key={index} className="p-4 sm:p-5 bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <p className="text-gray-900 truncate max-w-full sm:max-w-[70%]">
                    {comm.note}
                  </p>
                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <span className="text-xs font-medium px-3 py-1 bg-orange-100 text-orange-800 rounded-full uppercase tracking-wide">
                      {comm.type || 'note'}
                    </span>
                  <p className="text-xs text-gray-600 flex items-center">
                    <FaCalendarAlt className="mr-2 text-orange-500" />
                    {comm.date}
                  </p>
                  <button
                    onClick={async () => {
                      if (!window.confirm('Are you sure you want to delete this communication log?')) return;
                      try {
                        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://cob.sequoia-print.com'}/api/communications/${comm.id}`, {
                          method: 'DELETE',
                        });
                        if (res.ok) {
                          setCommunications(communications.filter((_, i) => i !== index));
                        } else {
                          alert('Failed to delete communication log');
                        }
                      } catch (err) {
                        console.error('Error deleting communication log:', err);
                        alert('Error deleting communication log');
                      }
                    }}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                    title="Delete communication log"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>
          ))}
            {communications.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No communications logged yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Notes */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-5 text-gray-900">
          <div className="p-3 bg-orange-100 rounded-lg">
            <FaPencilAlt className="text-orange-600 text-xl" />
          </div>
          <h3 className="text-lg sm:text-xl">Project Notes</h3>
        </div>
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          {!isEditingNotes ? (
            <>
              <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                {project.notes || "No notes available for this project."}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setEditedNotes(project.notes || '');
                    setIsEditingNotes(true);
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Edit Notes
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete all notes?')) {
                      updateProject(project.id || project.Id, { Notes: '' }).then(success => {
                        if (success) {
                          setProject(prev => ({ ...prev, notes: '' }));
                        } else {
                          alert('Failed to delete notes');
                        }
                      });
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Notes
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 text-sm sm:text-base"
                rows={6}
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    updateProject(project.id || project.Id, { Notes: editedNotes }).then(success => {
                      if (success) {
                        setProject(prev => ({ ...prev, notes: editedNotes }));
                        setIsEditingNotes(false);
                      } else {
                        alert('Failed to save notes');
                      }
                    });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedNotes(project.notes || '');
                    setIsEditingNotes(false);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add File Modal */}
      {showAddFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-900">Add File</h3>
              <button 
                onClick={() => setShowAddFileModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newFile.name}
                  onChange={(e) => setNewFile({...newFile, name: e.target.value})}
                  placeholder="Enter file name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Link</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newFile.link}
                  onChange={(e) => setNewFile({...newFile, link: e.target.value})}
                  placeholder="Paste Google Drive link"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newFile.type}
                  onChange={(e) => setNewFile({...newFile, type: e.target.value})}
                >
                  <option value="pdf">PDF</option>
                  <option value="ai">AI</option>
                  <option value="psd">PSD</option>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="doc">DOC</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  value={newFile.note}
                  onChange={(e) => setNewFile({...newFile, note: e.target.value})}
                  placeholder="Add any notes about this file"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddFileModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFile}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Communication Modal */}
      {showAddCommModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-900">Add Communication Log</h3>
              <button 
                onClick={() => setShowAddCommModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newCommunication.date}
                  onChange={(e) => setNewCommunication({...newCommunication, date: e.target.value})}
                  placeholder="Select date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newCommunication.type}
                  onChange={(e) => setNewCommunication({...newCommunication, type: e.target.value})}
                >
                  <option value="email">Email</option>
                  <option value="call">Phone Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Internal Note</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Log</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="4"
                  value={newCommunication.note}
                  onChange={(e) => setNewCommunication({...newCommunication, note: e.target.value})}
                  placeholder="Enter communication log details"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddCommModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCommunication}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Add Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;