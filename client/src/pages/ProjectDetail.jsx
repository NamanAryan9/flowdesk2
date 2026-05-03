import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import TaskTable from '../components/TaskTable';
import { Plus, UserPlus, FolderKanban } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Form states
  const [taskData, setTaskData] = useState({ title: '', description: '', assigneeId: '', dueDate: '', status: 'todo' });
  const [memberSearch, setMemberSearch] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get('/projects'), 
        api.get(`/projects/${id}/tasks`)
      ]);
      const currentProj = projRes.data.find(p => p._id === id);
      setProject(currentProj);
      setTasks(tasksRes.data);

      if (user?.role === 'admin') {
        const usersRes = await api.get('/auth/users');
        setAllUsers(usersRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/tasks`, taskData);
      setShowTaskModal(false);
      setTaskData({ title: '', description: '', assigneeId: '', dueDate: '', status: 'todo' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add task');
    }
  };

  const handleAddMember = async (selectedEmail) => {
    try {
      await api.post(`/projects/${id}/members`, { email: selectedEmail });
      setShowMemberModal(false);
      setMemberSearch('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.errors?.[0]?.message || 'Failed to add member');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading project...</div>;
  if (!project) return <div className="p-8 text-center text-red-500">Project not found or access denied.</div>;

  const isAdmin = user?.role === 'admin';
  
  // Filter users for search, excluding those already in the project
  const filteredUsers = allUsers.filter(u => 
    (u.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
     u.email.toLowerCase().includes(memberSearch.toLowerCase())) &&
    !project.members.some(m => m._id === u._id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <FolderKanban className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Project Space</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-600 mt-1 max-w-2xl">{project.description}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowMemberModal(true)}
              className="flex items-center gap-2 border border-slate-300 bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Member</span>
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Project Tasks</h2>
        </div>
        <TaskTable tasks={tasks} isAdmin={isAdmin} onUpdate={fetchData} />
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Assign New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500"
                  value={taskData.title}
                  onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500"
                  value={taskData.description}
                  onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500"
                  value={taskData.assigneeId}
                  onChange={(e) => setTaskData({...taskData, assigneeId: e.target.value})}
                >
                  <option value="">Select a member</option>
                  {project.members.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Team Member</h2>
              <button onClick={() => setShowMemberModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Search Users</label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <button
                    key={u._id}
                    onClick={() => handleAddMember(u.email)}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors flex flex-col"
                  >
                    <span className="text-sm font-semibold text-slate-900">{u.name}</span>
                    <span className="text-xs text-slate-500">{u.email} • {u.role}</span>
                  </button>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="px-4 py-8 text-center text-slate-500 text-sm italic">
                    {memberSearch ? 'No matching users found.' : 'All users are already members.'}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setShowMemberModal(false)} 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
