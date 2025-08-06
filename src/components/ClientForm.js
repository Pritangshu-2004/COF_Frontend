import React, { useContext, useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaSave, 
  FaLightbulb, 
  FaClipboardList, 
  FaCalendarDay 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ProjectsContext } from '../contexts/ProjectsContext';

const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
};

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

const ClientForm = () => {
  const navigate = useNavigate();
  const { fetchProjects, projects } = useContext(ProjectsContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    priority: "medium",
    notes: "",
    dueDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.projectType || !formData.dueDate) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Duplicate check
    const duplicate = projects.some(
      p =>
        p.Name?.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
        p.Project_type?.trim().toLowerCase() === formData.projectType.trim().toLowerCase()
    );

    if (duplicate) {
      setError('A project with this client and project type already exists!');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Company: formData.company,
        Project_type: formData.projectType,
        Notes: formData.notes,
        Due_date: formData.dueDate,
        Status: "briefed", // Default status
        Progress: 0, // Default progress
      };

      const token = localStorage.getItem('token') || document.cookie.match(new RegExp('(^| )token=([^;]+)'))?.[2];
      console.log('Submitting client data:', payload, 'with token:', token);
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        'https://cob.sequoia-print.com/api/projects', 
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', response.status, errorData);
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      // Reset form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        notes: "",
        dueDate: ""
      });

      await fetchProjects();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setIsSubmitting(false);
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
        <p className="text-gray-500 mt-2 ml-0 sm:ml-16">
          Fill in the details below to add a new client
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Name */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider">
              Client Name *
            </label>
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
                placeholder="Client name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider">
              Email *
            </label>
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
                placeholder="client@example.com"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider">
              Phone
            </label>
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
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider">
              Company
            </label>
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
                placeholder="Company name"
              />
            </div>
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <FaClipboardList className="text-gray-500" /> Project Type *
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition duration-200 appearance-none bg-white"
              required
            >
              <option value="">Select project type</option>
              <option value="Rigid Box">Rigid Box</option>
              <option value="Folding Carton">Folding Carton</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Project Deadline */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <FaCalendarDay className="text-gray-500" /> Project Deadline *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition duration-200"
              required
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
            />
          </div>
        </div>

        {/* Additional Notes */}
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

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg hover:shadow-orange-200 transition duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-orange-600 hover:to-orange-700'
            }`}
          >
            <FaSave className="text-lg" /> 
            <span className="font-medium">
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;