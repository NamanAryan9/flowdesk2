import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, LogOut, FolderKanban, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2 font-bold text-emerald-600 text-xl">
              <CheckSquare className="w-8 h-8" />
              <span>Flowdesk</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/dashboard" className="border-transparent text-slate-500 hover:border-emerald-500 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/projects" className="border-transparent text-slate-500 hover:border-emerald-500 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Projects
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-slate-900">{user.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
