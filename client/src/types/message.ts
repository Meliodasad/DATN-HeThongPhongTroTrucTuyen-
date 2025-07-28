export interface Message {
  id: string;
  hostId: string;
  tenantId: string;
  senderId: string;
  message: string;
  time: string;
  isRead: boolean;
  sender: {
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  receiver: {
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

export interface MessageStats {
  total: number;
  unread: number;
  today: number;
  thisWeek: number;
}

export interface MessageFilters {
  isRead?: boolean;
  senderId?: string;
  receiverId?: string;
  dateFrom?: string;
  dateTo?: string;
}