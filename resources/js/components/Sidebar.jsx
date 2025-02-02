import React from 'react';
import { Package, Users, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ onNavigate, currentView, isOpen, onToggle }) => {
  const { user } = useAuth();
  const isAdminOrEditor = user?.role_id === 1 || user?.role_id === 2;

  const menuItems = [
    {
      id: 'products',
      label: 'Productos',
      icon: <Package className="w-5 h-5" />,
      show: true
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: <Users className="w-5 h-5" />,
      show: user?.role_id === 1
    }
  ];

  if (!isAdminOrEditor) return null;

  return (
    <>
      <div className={`
        fixed top-0 left-0 h-screen w-64
        transition-transform duration-300 ease-in-out
        bg-base-200 shadow-xl z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className=" pt-14 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
            <img src="https://res.cloudinary.com/dgtw29rkr/image/upload/e_bgremoval/bvn7bo5n5dg3wgshtmpf" alt="logo" height={200} width={200}/>
          </h2>
          <button 
            className="lg:hidden btn btn-circle btn-ghost"
            onClick={() => onToggle(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="menu p-4">
          {menuItems.map(item => item.show && (
            <li key={item.id}>
              <button
                className={`flex items-center gap-4 ${
                  currentView === item.id ? 'active' : ''
                }`}
                onClick={() => {
                  onNavigate(item.id);
                  onToggle(false);
                }}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
};

export default Sidebar;