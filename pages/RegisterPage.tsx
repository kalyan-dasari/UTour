
import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { Role } from '../types';

interface RegisterPageProps {
  onRegister: (name: string, phone: string, role: Role) => Promise<void>;
  onNavigate: (page: 'login') => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>(Role.RIDER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !phone) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);
    try {
      await onRegister(name, phone, role);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-teal-600 mb-6">Join UTour</h1>
        <Card>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              required
            />
            <Input
              id="phone"
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 1234567890"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setRole(Role.RIDER)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${role === Role.RIDER ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold' : 'bg-white border-gray-300'}`}
                >
                  Rider
                </button>
                <button
                  type="button"
                  onClick={() => setRole(Role.DRIVER)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${role === Role.DRIVER ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold' : 'bg-white border-gray-300'}`}
                >
                  Driver
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" isLoading={isLoading}>
              Register
            </Button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="font-semibold text-teal-600 hover:underline">
              Login here
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
