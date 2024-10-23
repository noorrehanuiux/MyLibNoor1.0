import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Users, 
  History, 
  Settings, 
  Info, 
  LogOut,
  Library
} from 'lucide-react';

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: <Library size={20} />, label: 'Dashboard' },
    { path: '/borrow', icon: <BookOpen size={20} />, label: 'Borrow/Return' },
    { path: '/students', icon: <Users size={20} />, label: 'Students' },
    { path: '/books', icon: <BookOpen size={20} />, label: 'Books' },
    { path: '/history', icon: <History size={20} />, label: 'History' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    { path: '/about', icon: <Info size={20} />, label: 'About' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Library size={24} />
                <span className="font-bold text-xl">MyLib1.0</span>
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:bg-indigo-700 px-3 py-2 rounded"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] shadow-lg">
          <nav className="mt-5 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : ''
                }`}
              >
                {item.icon}
                <span className="mx-4">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;