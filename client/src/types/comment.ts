export interface Comment {
  id: number;
  content: string;
  author: string;
  authorEmail: string;
  roomId: number;
  roomTitle: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  rating?: number;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: number;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface CommentFormData {
  content: string;
  author: string;
  authorEmail: string;
  roomId: number;
  roomTitle: string;
  rating?: number;
}

export interface CommentReplyFormData {
  content: string;
  author: string;
  authorEmail: string;
  isAdmin: boolean;
}

export interface CommentStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  averageRating: number;
}