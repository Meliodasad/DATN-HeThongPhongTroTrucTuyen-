export interface Room {
<<<<<<< HEAD
  id: number;
  title: string;
  description: string;
  address: string;
  district: string;
  city: string;
  price: number;
  area: number;
  roomType: 'single' | 'shared' | 'apartment' | 'studio';
  amenities: string[];
  images: string[];
  landlordId: number;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  status: 'available' | 'rented' | 'maintenance';
  createdAt: string;
  updatedAt: string;
  maxOccupants: number;
  deposit: number;
  electricityCost: number;
  waterCost: number;
  internetIncluded: boolean;
  parkingIncluded: boolean;
  petAllowed: boolean;
}
=======
  id: string;
  title: string;
  description?: string;
  price: number;
  area: number;
  address: string;
  type: 'single' | 'shared' | 'apartment' | 'studio';
  status: 'available' | 'rented' | 'maintenance' | 'pending' | 'rejected';
  amenities?: string[];
  images?: string[];
  owner: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  approved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
   pending: number;
  rejected: number;
}
 
>>>>>>> xuan-tung

export interface RoomFormData {
  title: string;
  description: string;
  address: string;
<<<<<<< HEAD
  district: string;
  city: string;
  price: number;
  area: number;
  roomType: Room['roomType'] | '';
  amenities: string[];
  images: string[];
  landlordId: number;
  maxOccupants: number;
  deposit: number;
  electricityCost: number;
  waterCost: number;
  internetIncluded: boolean;
  parkingIncluded: boolean;
  petAllowed: boolean;
}

export interface RoomFormErrors {
  title?: string;
  description?: string;
  address?: string;
  district?: string;
  roomType?: string;
  price?: string;
  area?: string;
  maxOccupants?: string;
=======
  price: number;
  type: 'single' | 'shared' | 'apartment' | 'studio';
  status: 'available' | 'rented' | 'maintenance';
  owner: string;
  ownerId: number;
  area: number;
  amenities: string[];
  images: string[];
>>>>>>> xuan-tung
}

export interface RoomStats {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
<<<<<<< HEAD
  byType: Record<Room['roomType'], number>;
  averagePrice: number;
  totalRevenue: number;
}

export interface RoomFilters {
  search: string;
  district: string;
  roomType: Room['roomType'] | 'all';
  status: Room['status'] | 'all';
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
=======
  byType: {
    single: number;
    shared: number;
    apartment: number;
    studio: number;
  };
  averagePrice: number;
  totalRevenue: number;
>>>>>>> xuan-tung
}