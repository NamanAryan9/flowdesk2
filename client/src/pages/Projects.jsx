import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Plus, FolderKanban, Users, Trash2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newName, description: newDesc });
      setShowModal(false);
      setNewName('');
      setNewDesc('');
      fetchProjects();
    } catch (error) {
      alert('Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(projects) && projects.map((project) => (
          <div key={project._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <FolderKanban className="w-6 h-6" />
              </div>
              {user?.role === 'admin' && (
                <button onClick={() => handleDelete(project._id)} className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <Link to={`/projects/${project._id}`}>
              <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-emerald-600 transition-colors">{project.name}</h3>
            </Link>
            <p className="text-slate-600 text-sm mb-6 line-clamp-2">{project.description || 'No description provided.'}</p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Users className="w-4 h-4" />
              <span>{project.members?.length || 0} Members</span>
            </div>
          </div>
        ))}
        {Array.isArray(projects) && projects.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-xl border-2 border-dashed border-slate-200">
            No projects found. Create one to get started.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
