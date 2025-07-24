export interface Review {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  roomId: number;
  roomTitle: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  images?: string[];
  isVerified: boolean;
  isRecommended: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: {
    content: string;
    respondedBy: string;
    respondedAt: string;
  };
}

export interface ReviewFormData {
  userId: number;
  userName: string;
  userEmail: string;
  roomId: number;
  roomTitle: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  images?: string[];
  isRecommended: boolean;
}

export interface ReviewStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  recommendationRate: number;
}

export interface AdminResponse {
  content: string;
  respondedBy: string;
}