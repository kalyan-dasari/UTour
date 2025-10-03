
import React from 'react';
import Card from '../components/Card';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-lg text-gray-900">{user.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg text-gray-900 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
