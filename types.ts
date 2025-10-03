
export enum Role {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
}

export enum RideStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
}

export interface Ride {
  id: string;
  riderId: string;
  rider: User;
  driverId: string | null;
  driver: User | null;
  pickupLocation: string;
  dropLocation: string;
  status: RideStatus;
  fare: number;
  createdAt: number;
}
