export interface ICommentReply {
  id: string | number;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface IComment {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  roomId: string | number;
  roomTitle: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  rating?: number;
  replies?: ICommentReply[];
}
