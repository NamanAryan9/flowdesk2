import api from '../api/api';
import { Clock, CheckCircle2, Circle, Trash2 } from 'lucide-react';

const TaskTable = ({ tasks, isAdmin, onUpdate }) => {
  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      onUpdate();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      onUpdate();
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3"/> Done</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3"/> In Progress</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"><Circle className="w-3 h-3"/> Todo</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Task</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assignee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">{task.title}</div>
                <div className="text-xs text-slate-500">{task.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {task.project?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {task.assignee?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(task.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className="text-xs border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  {isAdmin && (
                    <button onClick={() => deleteTask(task._id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-10 text-center text-slate-500 italic">No tasks found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
