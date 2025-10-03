
import React, { useState, useEffect, useCallback } from 'react';
import { apiGetAvailableRides, apiAcceptRide, apiCompleteRide, apiGetActiveDriverRide } from '../services/mockApiService';
import { User, Ride, RideStatus } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

interface DriverDashboardProps {
  user: User;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user }) => {
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRides = useCallback(async () => {
    try {
      const active = await apiGetActiveDriverRide(user.id);
      if (active) {
        setActiveRide(active);
        setAvailableRides([]);
      } else {
        setActiveRide(null);
        const available = await apiGetAvailableRides();
        setAvailableRides(available);
      }
    } catch (err) {
      setError('Failed to fetch rides.');
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchRides();
    const interval = setInterval(fetchRides, 5000); // Poll for new rides
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptRide = async (rideId: string) => {
    setActionLoading(rideId);
    setError('');
    try {
      const acceptedRide = await apiAcceptRide(rideId, user.id);
      setActiveRide(acceptedRide);
      setAvailableRides(rides => rides.filter(r => r.id !== rideId));
    } catch (err: any) {
      setError(err.message || 'Could not accept ride.');
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleCompleteRide = async (rideId: string) => {
    setActionLoading(rideId);
    setError('');
    try {
        await apiCompleteRide(rideId, user.id);
        setActiveRide(null);
        fetchRides(); // Refresh list of available rides
    } catch (err: any) {
      setError(err.message || 'Could not complete ride.');
    } finally {
        setActionLoading(null);
    }
  };


  const renderActiveRide = () => {
    if (!activeRide) return null;
    return (
        <Card>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Active Ride</h2>
            <p className="text-gray-500 mb-6">You are on your way to pick up {activeRide.rider.name}.</p>
             <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="font-semibold text-gray-500">From:</span> <span className="text-right font-medium text-gray-800">{activeRide.pickupLocation}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-500">To:</span> <span className="text-right font-medium text-gray-800">{activeRide.dropLocation}</span></div>
                 <div className="flex justify-between items-baseline"><span className="font-semibold text-gray-500">Rider:</span> <span className="text-right font-medium text-gray-800">{activeRide.rider.name} ({activeRide.rider.phone})</span></div>
                <div className="flex justify-between items-baseline"><span className="font-semibold text-gray-500">Fare:</span> <span className="text-right font-bold text-2xl text-teal-600">₹{activeRide.fare}</span></div>
            </div>
            <Button
                onClick={() => handleCompleteRide(activeRide.id)}
                isLoading={actionLoading === activeRide.id}
                className="mt-6"
            >
                Complete Ride
            </Button>
        </Card>
    );
  };

  const renderAvailableRides = () => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Rides</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {availableRides.length === 0 ? (
        <Card>
            <p className="text-center text-gray-600">No available rides at the moment. We'll notify you when a new request comes in.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {availableRides.map(ride => (
            <Card key={ride.id}>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <p className="font-bold text-lg text-gray-800">{ride.pickupLocation}</p>
                  <p className="text-sm text-gray-500">to</p>
                  <p className="font-semibold text-md text-gray-700">{ride.dropLocation}</p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="text-2xl font-bold text-teal-600">₹{ride.fare}</p>
                   <Button
                    onClick={() => handleAcceptRide(ride.id)}
                    isLoading={actionLoading === ride.id}
                    className="mt-2 w-full md:w-auto"
                   >
                    Accept Ride
                   </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {isLoading ? <Spinner /> : (activeRide ? renderActiveRide() : renderAvailableRides())}
    </div>
  );
};

export default DriverDashboard;
