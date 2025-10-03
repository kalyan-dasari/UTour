
import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

interface LoginPageProps {
  onLogin: (phone: string) => Promise<void>;
  onNavigate: (page: 'register') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone) {
      setError('Phone number is required.');
      return;
    }
    setIsLoading(true);
    try {
      await onLogin(phone);
      // Success will be handled by the parent component (App.tsx)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-teal-600 mb-6">Welcome to UTour</h1>
        <Card>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="phone"
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 1111111111"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" isLoading={isLoading}>
              Login
            </Button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')} className="font-semibold text-teal-600 hover:underline">
              Register here
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
