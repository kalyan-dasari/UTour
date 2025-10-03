
import React from 'react';
import { User, Role } from '../types';

interface HeaderProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 
              onClick={() => onNavigate(user ? (user.role === Role.RIDER ? 'riderDashboard' : 'driverDashboard') : 'login')}
              className="text-2xl font-bold text-teal-600 cursor-pointer"
            >
              UTour
            </h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('profile')}
                className="text-gray-600 hover:text-teal-600 transition"
              >
                Profile
              </button>
              <button
                onClick={onLogout}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
