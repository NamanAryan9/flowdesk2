import { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import TaskTable from '../components/TaskTable';
import { ListTodo, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, done: 0, overdue: 0, dueThisWeek: 0 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [statsRes, projectsRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/projects')
      ]);
      setStats(statsRes.data);
      
      // For dashboard we show all user tasks across projects
      // We need to fetch tasks for each project
      const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      const taskPromises = projects.map(p => api.get(`/projects/${p._id}/tasks`));
      const taskResults = await Promise.all(taskPromises);
      const allTasks = taskResults.flatMap(res => (Array.isArray(res.data) ? res.data : []));
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} color="emerald" />
        <StatCard title="Completed" value={stats.done} icon={CheckCircle2} color="green" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} color="red" />
        <StatCard title="Due This Week" value={stats.dueThisWeek} icon={Calendar} color="amber" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Your Tasks</h2>
        </div>
        <TaskTable tasks={tasks} isAdmin={user?.role === 'admin'} onUpdate={fetchData} />
      </div>
    </div>
  );
};

export default Dashboard;
