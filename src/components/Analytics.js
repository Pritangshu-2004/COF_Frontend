import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiPrinter, FiTruck, FiPackage } from 'react-icons/fi';
import { FaRegCalendarAlt } from 'react-icons/fa';

const projectsByStageData = [
  { stage: 'Briefed', count: 1, icon: <FiPackage className="inline mr-1 sm:mr-2" /> },
  { stage: 'Approved', count: 1, icon: <FiCheckCircle className="inline mr-1 sm:mr-2" /> },
  { stage: 'In Print', count: 1, icon: <FiPrinter className="inline mr-1 sm:mr-2" /> },
  { stage: 'Packed', count: 1, icon: <FiPackage className="inline mr-1 sm:mr-2" /> },
  { stage: 'Dispatched', count: 1, icon: <FiTruck className="inline mr-1 sm:mr-2" /> },
];

const COLORS = ['#FF8C00', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2'];

const onTimeDeliveryData = [
  { name: 'On Time', value: 92, color: '#10B981' },
  { name: 'Late', value: 8, color: '#EF4444' },
];

const projectsOverview = [
  {
    risk: 'high',
    client: 'Evergreen Co.',
    project: 'Rigid Box Packaging',
    stage: 'In Print',
    dueDate: 'Nov 15, 2023',
    nextAction: 'Monitor printing and prepare for packing.',
  },
  {
    risk: 'medium',
    client: 'Bloom & Bud',
    project: 'Luxury Gift Set',
    stage: 'In Proofing',
    dueDate: 'Dec 1, 2023',
    nextAction: 'Awaiting foil feedback from client.',
  },
  {
    risk: 'high',
    client: 'Tech Innovate',
    project: 'Folding Carton',
    stage: 'Approved',
    dueDate: 'Dec 10, 2023',
    nextAction: 'Schedule for printing next week.',
  },
  {
    risk: 'low',
    client: 'Artisan Goods',
    project: 'Product Labels',
    stage: 'Briefed',
    dueDate: 'Nov 25, 2023',
    nextAction: 'Awaiting artwork from client designer.',
  },
  {
    risk: 'none',
    client: 'Global Exports',
    project: 'Shipping Cartons',
    stage: 'Dispatched',
    dueDate: 'Oct 30, 2023',
    nextAction: 'Project complete. Follow up for invoicing.',
  },
];

const stageBadgeColors = {
  'Briefed': 'bg-blue-100 text-blue-800',
  'Approved': 'bg-green-100 text-green-800',
  'In Print': 'bg-purple-100 text-purple-800',
  'In Proofing': 'bg-yellow-100 text-yellow-800',
  'Dispatched': 'bg-indigo-100 text-indigo-800',
};

const riskBadgeColors = {
  'high': 'bg-red-100 text-red-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'low': 'bg-blue-100 text-blue-800',
  'none': 'bg-gray-100 text-gray-800',
};

const Analytics = () => {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-800">Project Analytics</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Real-time insights into your packaging projects</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-200 text-xs sm:text-sm">
          <span className="text-gray-500">Updated: </span>
          <span className="font-medium">Today, 11:42 AM</span>
        </div>
      </div>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {[
          { title: 'Total Projects', value: '24', change: '↑ 12%', color: 'border-orange-500', trend: 'up' },
          { title: 'On Time Rate', value: '92%', change: '↑ 5%', color: 'border-blue-500', trend: 'up' },
          { title: 'At Risk', value: '3', change: '↓ 2', color: 'border-red-500', trend: 'down' },
          { title: 'Completed', value: '14', change: '↑ 8', color: 'border-green-500', trend: 'up' },
        ].map((stat, index) => (
          <div key={index} className={`bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 md:p-6 border-l-4 ${stat.color}`}>
            <h3 className="text-gray-500 text-[10px] sm:text-xs font-medium">{stat.title}</h3>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 mt-0.5 sm:mt-1">{stat.value}</p>
            <p className={`${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center`}>
              <span>{stat.change} from last {stat.title.includes('Rate') ? 'quarter' : 'month'}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Projects by Stage Bar Chart */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 md:p-6 col-span-1 lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 md:mb-6 gap-2">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl text-gray-800">Projects by Stage</h2>
              <p className="text-gray-500 text-[10px] sm:text-xs">Distribution across workflow stages</p>
            </div>
            <select className="bg-gray-100 border-0 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-[10px] sm:text-xs focus:ring-1 sm:focus:ring-2 focus:ring-orange-300">
              <option>Last 30 days</option>
              <option>Last quarter</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-48 sm:h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByStageData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis 
                  dataKey="stage" 
                  stroke="#9CA3AF" 
                  tick={({ x, y, payload }) => (
                    <g transform={`translate(${x},${y})`}>
                      <text x={0} y={0} dy={12} textAnchor="middle" fill="#6B7280" className="text-[10px] sm:text-xs">
                        {payload.value}
                      </text>
                    </g>
                  )}
                />
                <YAxis stroke="#9CA3AF" tickCount={5} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]} 
                  background={{ fill: '#F3F4F6', radius: [4, 4, 0, 0] }}
                >
                  {projectsByStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* On-Time Delivery Donut Chart */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col">
          <div className="mb-3 sm:mb-4 md:mb-6">
            <h2 className="text-base sm:text-lg md:text-xl text-gray-800">Delivery Performance</h2>
            <p className="text-gray-500 text-[10px] sm:text-xs">On-time vs late deliveries</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-40 sm:h-48 md:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={onTimeDeliveryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={450}
                    stroke="none"
                  >
                    {onTimeDeliveryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-xl sm:text-2xl md:text-4xl text-gray-800">92%</span>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">On Time</p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 md:gap-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1 sm:mr-2"></div>
              <span className="text-[10px] sm:text-xs text-gray-600">On Time (92%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1 sm:mr-2"></div>
              <span className="text-[10px] sm:text-xs text-gray-600">Late (8%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Overview Table - Mobile Optimized */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 md:mb-6 gap-2">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl text-gray-800">Active Projects</h2>
              <p className="text-gray-500 text-[10px] sm:text-xs">Detailed view of all current projects</p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-colors">
              Export Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="hidden sm:table-cell px-2 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="hidden md:table-cell px-2 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="hidden lg:table-cell px-2 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Next Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projectsOverview.map((proj, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-6 md:py-3 whitespace-nowrap">
                    {proj.risk !== 'none' ? (
                      <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${riskBadgeColors[proj.risk]}`}>
                        {proj.risk === 'high' && <FiAlertTriangle className="inline mr-0.5 sm:mr-1" />}
                        {proj.risk.charAt(0).toUpperCase() + proj.risk.slice(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-6 md:py-3 whitespace-nowrap font-medium text-gray-900 text-xs sm:text-sm md:text-base">
                    {proj.client}
                  </td>
                  <td className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-6 md:py-3 whitespace-nowrap text-gray-900 text-xs sm:text-sm md:text-base">
                    {proj.project}
                  </td>
                  <td className="hidden sm:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-6 md:py-3 whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${stageBadgeColors[proj.stage] || 'bg-gray-100 text-gray-800'}`}>
                      {proj.stage}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-6 md:py-3 whitespace-nowrap text-gray-900 text-xs sm:text-sm md:text-base flex items-center">
                    <FaRegCalendarAlt className="text-gray-400 mr-0.5 sm:mr-1 md:mr-2" />
                    {proj.dueDate}
                  </td>
                  <td className="hidden lg:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-6 md:py-3 text-gray-700 text-xs sm:text-sm md:text-base max-w-xs">
                    {proj.nextAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-2 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-1 sm:gap-2">
          <div className="text-[10px] sm:text-xs text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">24</span> projects
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <button className="px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-md bg-white border border-gray-300 text-[10px] sm:text-xs font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-md bg-orange-500 border border-orange-500 text-[10px] sm:text-xs font-medium text-white hover:bg-orange-600">
              1
            </button>
            <button className="px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-md bg-white border border-gray-300 text-[10px] sm:text-xs font-medium text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-md bg-white border border-gray-300 text-[10px] sm:text-xs font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Project Cards - Hidden on desktop */}
      <div className="sm:hidden space-y-2">
        {projectsOverview.map((proj, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-3 border-l-4 border-gray-200">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-gray-900 text-sm">{proj.client}</h3>
              {proj.risk !== 'none' && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${riskBadgeColors[proj.risk]}`}>
                  {proj.risk.charAt(0).toUpperCase() + proj.risk.slice(1)}
                </span>
              )}
            </div>
            <p className="text-gray-800 text-xs mb-1">{proj.project}</p>
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <span className={`px-1 py-0.5 rounded-full mr-1 ${stageBadgeColors[proj.stage] || 'bg-gray-100 text-gray-800'}`}>
                {proj.stage}
              </span>
              <FaRegCalendarAlt className="mr-1" />
              <span>{proj.dueDate}</span>
            </div>
            <p className="text-gray-600 text-xs mt-1">
              <span className="font-medium">Next:</span> {proj.nextAction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;