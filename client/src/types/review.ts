export interface Review {
  id: string;
  roomId: string;
  tenantId: string;
  review: string;
  rating: number;
  reviewDate: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  replies?: ReviewReply[];
  room: {
    roomTitle: string;
    location: string;
    area: number;
    price: number;
    images: string[];
    host: {
      fullName: string;
      email: string;
      avatar?: string;
    };
  };
  tenant: {
    fullName: string;
    email: string;
    avatar?: string;
  };
}

export interface ReviewReply {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface ReviewReplyFormData {
  content: string;
  author: string;
  authorEmail: string;
  isAdmin: boolean;
}

export interface ReviewFilters {
  status?: 'all' | 'pending' | 'approved' | 'rejected';
  rating?: number;
  roomId?: string;
  tenantId?: string;
  dateFrom?: string;
  dateTo?: string;
}