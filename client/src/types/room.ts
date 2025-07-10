export interface Room {
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

export interface RoomFormData {
  title: string;
  description: string;
  address: string;
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
}

export interface RoomStats {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
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
}