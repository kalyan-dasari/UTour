
import { User, Ride, Role, RideStatus } from '../types';

// In-memory database
let users: User[] = [
    { id: 'user-1', name: 'Alice Rider', phone: '1111111111', role: Role.RIDER },
    { id: 'user-2', name: 'Bob Driver', phone: '2222222222', role: Role.DRIVER },
];
let rides: Ride[] = [];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Auth ---
export const apiRegister = async (name: string, phone: string, role: Role): Promise<User> => {
    await delay(500);
    if (users.find(u => u.phone === phone)) {
        throw new Error('User with this phone number already exists.');
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        phone,
        role,
    };
    users.push(newUser);
    return newUser;
};

export const apiLogin = async (phone: string): Promise<{ user: User; token: string }> => {
    await delay(500);
    const user = users.find(u => u.phone === phone);
    if (!user) {
        throw new Error('Invalid credentials.');
    }
    const token = `mock-jwt-token-for-${user.id}`;
    return { user, token };
};

export const apiGetUserFromToken = async (token: string): Promise<User | null> => {
    await delay(200);
    const userId = token.replace('mock-jwt-token-for-', '');
    const user = users.find(u => u.id === userId);
    return user || null;
};


// --- Rides ---
export const apiCreateRide = async (riderId: string, pickupLocation: string, dropLocation: string): Promise<Ride> => {
    await delay(1000);
    const rider = users.find(u => u.id === riderId);
    if (!rider) throw new Error('Rider not found.');

    // Simple fare calculation stub
    const distance = Math.floor(Math.random() * 8) + 2; // Random 2-10 km
    const fare = distance * 15; // ₹15/km

    const newRide: Ride = {
        id: `ride-${Date.now()}`,
        riderId,
        rider,
        driverId: null,
        driver: null,
        pickupLocation,
        dropLocation,
        status: RideStatus.PENDING,
        fare,
        createdAt: Date.now(),
    };
    rides.push(newRide);
    return newRide;
};

export const apiGetAvailableRides = async (): Promise<Ride[]> => {
    await delay(500);
    return rides.filter(r => r.status === RideStatus.PENDING);
};

export const apiAcceptRide = async (rideId: string, driverId: string): Promise<Ride> => {
    await delay(1000);
    const ride = rides.find(r => r.id === rideId);
    const driver = users.find(u => u.id === driverId);
    if (!ride || !driver) throw new Error('Ride or Driver not found.');
    if (ride.status !== RideStatus.PENDING) throw new Error('Ride is no longer available.');
    
    ride.status = RideStatus.ACCEPTED;
    ride.driverId = driverId;
    ride.driver = driver;
    
    return ride;
};

export const apiCompleteRide = async (rideId: string, driverId: string): Promise<Ride> => {
    await delay(1000);
    const ride = rides.find(r => r.id === rideId);
    if (!ride) throw new Error('Ride not found.');
    if (ride.driverId !== driverId) throw new Error('Driver not authorized to complete this ride.');

    ride.status = RideStatus.COMPLETED;
    return ride;
};

export const apiGetActiveRiderRide = async (riderId: string): Promise<Ride | null> => {
    await delay(500);
    const activeRide = rides.find(r => r.riderId === riderId && (r.status === RideStatus.PENDING || r.status === RideStatus.ACCEPTED));
    return activeRide || null;
};

export const apiGetActiveDriverRide = async (driverId: string): Promise<Ride | null> => {
    await delay(500);
    const activeRide = rides.find(r => r.driverId === driverId && r.status === RideStatus.ACCEPTED);
    return activeRide || null;
}
