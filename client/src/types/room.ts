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
  hostId: string;
  roomTitle: string;
  price: number;
  area: number;
<<<<<<< HEAD
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
=======
  location: string;
  description: string;
  images: string[];
  roomType: 'single' | 'shared' | 'apartment';
  status: 'available' | 'rented' | 'maintenance';
  utilities: string[];
  terms: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  createdAt: string;
  host?: {
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
>>>>>>> origin/xuan-tung
}

export interface RoomStats {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
<<<<<<< HEAD
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
=======
  pending: number;
  approved: number;
  rejected: number;
}

export interface RoomFilters {
  roomType?: Room['roomType'] | 'all';
  status?: Room['status'] | 'all';
  approvalStatus?: Room['approvalStatus'] | 'all';
  hostId?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  searchTerm?: string;
}

export interface CreateRoomData {
  hostId: string;
  roomTitle: string;
  price: number;
  area: number;
  location: string;
  description: string;
  images: string[];
  roomType: Room['roomType'];
  utilities: string[];
  terms: string;
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  status?: Room['status'];
  approvalStatus?: Room['approvalStatus'];
}
interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  bookingDate: string;
  note: string;
  bookingStatus: "pending" | "confirmed" | "cancelled";
  approvalStatus: "approved" | "rejected" | "waiting"; // 👈 Thêm dòng này
  createdAt: string;
  room: {
    roomTitle: string;
    location: string;
    price: number;
    images: string[];
  };
  tenant: {
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}
>>>>>>> origin/xuan-tung
