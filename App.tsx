
import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import { apiLogin, apiRegister, apiGetUserFromToken } from './services/mockApiService';
import { User, Role } from './types';
import Spinner from './components/Spinner';

type Page = 'login' | 'register' | 'riderDashboard' | 'driverDashboard' | 'profile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };
  
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    setCurrentPage('login');
  };

  const handleLogin = async (phone: string) => {
    const { user, token } = await apiLogin(phone);
    setUser(user);
    setToken(token);
    localStorage.setItem('authToken', token);
    if (user.role === Role.RIDER) {
      setCurrentPage('riderDashboard');
    } else {
      setCurrentPage('driverDashboard');
    }
  };

  const handleRegister = async (name: string, phone: string, role: Role) => {
    await apiRegister(name, phone, role);
    alert('Registration successful! Please log in.');
    setCurrentPage('login');
  };

  const validateToken = useCallback(async (tokenToValidate: string) => {
    try {
      const userFromToken = await apiGetUserFromToken(tokenToValidate);
      if (userFromToken) {
        setUser(userFromToken);
        setCurrentPage(userFromToken.role === Role.RIDER ? 'riderDashboard' : 'driverDashboard');
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, [token, validateToken]);

  const renderPage = () => {
    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    }
    
    if (!user) {
        switch (currentPage) {
            case 'register':
                return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
            default:
                return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
        }
    }

    switch (currentPage) {
        case 'riderDashboard':
            return <RiderDashboard user={user} />;
        case 'driverDashboard':
            return <DriverDashboard user={user} />;
        case 'profile':
            return <ProfilePage user={user} />;
        default:
            return user.role === Role.RIDER ? <RiderDashboard user={user} /> : <DriverDashboard user={user} />;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="container mx-auto p-4 sm:px-6 lg:px-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
