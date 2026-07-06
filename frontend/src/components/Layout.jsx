import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Home, Edit3, BarChart3, Mail } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? '🌱 Sprout' : '🌱'}
          </h1>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <NavLink
            to="/dashboard"
            icon={<Home size={20} />}
            label="Dashboard"
            collapsed={!sidebarOpen}
          />
          <NavLink
            to="/content"
            icon={<Edit3 size={20} />}
            label="Content"
            collapsed={!sidebarOpen}
          />
          <NavLink
            to="/analytics"
            icon={<BarChart3 size={20} />}
            label="Analytics"
            collapsed={!sidebarOpen}
          />
          <NavLink
            to="/inbox"
            icon={<Mail size={20} />}
            label="Inbox"
            collapsed={!sidebarOpen}
          />
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg w-full mb-2"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="w-full p-2 hover:bg-red-600 rounded-lg flex items-center gap-2"
          >
            <LogOut size={20} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Sprout Social</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome!</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label, collapsed }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      title={collapsed ? label : ''}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
