export interface Room {
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
 

export interface RoomFormData {
  title: string;
  description: string;
  address: string;
  price: number;
  type: 'single' | 'shared' | 'apartment' | 'studio';
  status: 'available' | 'rented' | 'maintenance';
  owner: string;
  ownerId: number;
  area: number;
  amenities: string[];
  images: string[];
}

export interface RoomStats {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
  byType: {
    single: number;
    shared: number;
    apartment: number;
    studio: number;
  };
  averagePrice: number;
  totalRevenue: number;
}