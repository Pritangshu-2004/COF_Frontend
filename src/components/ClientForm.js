import React, { useContext } from "react";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaSave, FaLightbulb, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ProjectsContext } from '../contexts/ProjectsContext';

const ClientForm = () => {
  const navigate = useNavigate();
  const { fetchProjects, projects } = useContext(ProjectsContext); // <-- get projects from context
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    notes: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Duplicate check: same client name and project type
    const duplicate = projects.some(
      p =>
        (p.Name?.trim().toLowerCase() === formData.name.trim().toLowerCase()) &&
        (p.Project_type?.trim().toLowerCase() === formData.projectType.trim().toLowerCase())
    );
    if (duplicate) {
      alert('A project with this client and project type already exists!');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Client saved successfully');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          notes: '',
        });
        await fetchProjects();
        navigate('/dashboard');
      } else {
        alert('Failed to save client');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl text-gray-800 flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-full">
            <FaUser className="text-orange-500 text-xl" />
          </div>
          <span>New Client Registration</span>
        </h2>
      <p className="text-gray-500 mt-2 ml-0 sm:ml-16 truncate">Fill in the details below to add a new client</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider">Client Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition duration-200"
                placeholder="Write your name here..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition duration-200"
                placeholder="client@gmail.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider">Phone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition duration-200"
                placeholder="+91 10551 25569"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider">Company</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="text-gray-400" />
              </div>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition duration-200"
                placeholder="Sequoia Print"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <FaClipboardList className="text-gray-500" /> Project Type
          </label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
          >
            <option value="">Select project type</option>
            <option value="Rigid Box">Rigid Box</option>
            <option value="Folding Carton">Folding Carton</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <FaLightbulb className="text-gray-500" /> Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition duration-200"
            placeholder="Any special requirements or comments..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg hover:shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition duration-300 transform hover:-translate-y-0.5"
          >
            <FaSave className="text-lg" /> 
            <span className="font-medium">Save Client</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
