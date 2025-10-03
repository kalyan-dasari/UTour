
import React, { useState, useEffect, useCallback } from 'react';
import { apiCreateRide, apiGetActiveRiderRide } from '../services/mockApiService';
import { User, Ride, RideStatus } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Spinner from '../components/Spinner';

interface RiderDashboardProps {
  user: User;
}

const RiderDashboard: React.FC<RiderDashboardProps> = ({ user }) => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [fare, setFare] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);

  const checkActiveRide = useCallback(async () => {
    setIsLoading(true);
    try {
      const ride = await apiGetActiveRiderRide(user.id);
      setActiveRide(ride);
    } catch (err) {
      setError('Failed to check for active rides.');
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    checkActiveRide();
    const interval = setInterval(checkActiveRide, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetFare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !drop) {
      setError('Please enter both pickup and drop locations.');
      return;
    }
    setError('');
    const distance = Math.floor(Math.random() * 8) + 2;
    setFare(distance * 15);
  };

  const handleBookRide = async () => {
    if (!fare) {
      setError('Please get a fare estimate first.');
      return;
    }
    setIsBooking(true);
    try {
      const newRide = await apiCreateRide(user.id, pickup, drop);
      setActiveRide(newRide);
      setPickup('');
      setDrop('');
      setFare(null);
    } catch (err: any) {
      setError(err.message || 'Failed to book ride.');
    } finally {
      setIsBooking(false);
    }
  };

  const renderRideStatus = () => {
    if (!activeRide) return null;

    let statusText = '';
    let statusDescription = '';
    switch (activeRide.status) {
      case RideStatus.PENDING:
        statusText = 'Searching for a driver...';
        statusDescription = 'We are looking for a nearby driver to accept your ride.';
        break;
      case RideStatus.ACCEPTED:
        statusText = 'Driver is on the way!';
        statusDescription = `${activeRide.driver?.name} is coming to pick you up.`;
        break;
      default:
        return null;
    }

    return (
        <Card className="w-full">
            <h3 className="text-2xl font-bold text-center text-teal-600 mb-4">{statusText}</h3>
            <div className="text-center mb-6">
                <Spinner />
                <p className="text-gray-600">{statusDescription}</p>
            </div>
            <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="font-semibold text-gray-500">From:</span> <span className="text-right">{activeRide.pickupLocation}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-500">To:</span> <span className="text-right">{activeRide.dropLocation}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-500">Fare:</span> <span className="text-right font-bold text-lg text-teal-600">₹{activeRide.fare}</span></div>
            </div>
        </Card>
    );
  };

  const renderBookingForm = () => {
    return (
      <Card className="w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Book a Ride</h2>
        <form onSubmit={handleGetFare} className="space-y-4">
          <Input
            id="pickup"
            label="Pickup Location"
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="e.g., Central Park"
            required
          />
          <Input
            id="drop"
            label="Drop Location"
            type="text"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            placeholder="e.g., Times Square"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit">Get Fare Estimate</Button>
        </form>
        {fare !== null && (
          <div className="mt-6 text-center bg-teal-50 p-4 rounded-lg">
            <p className="text-lg text-gray-700">Estimated Fare</p>
            <p className="text-4xl font-bold text-teal-600">₹{fare}</p>
            <Button onClick={handleBookRide} isLoading={isBooking} className="mt-4">
              Confirm & Book Ride
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {isLoading ? <Spinner /> : (activeRide ? renderRideStatus() : renderBookingForm())}
    </div>
  );
};

export default RiderDashboard;
