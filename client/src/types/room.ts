export interface Room {
  id: number;
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
  createdAt: string;
  updatedAt: string;
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