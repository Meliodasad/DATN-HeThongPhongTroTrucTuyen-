import type { Message, MessageStats, MessageFilters, CreateMessageData } from '../types/message';

class MessageService {
  private baseUrl = 'http://localhost:5000';

  async getMessages(filters?: MessageFilters): Promise<Message[]> {
    try {
      // Fetch messages and users
      const [messagesRes, usersRes] = await Promise.all([
        fetch(`${this.baseUrl}/messages`),
        fetch(`${this.baseUrl}/users`)
      ]);

      const [messagesData, usersData] = await Promise.all([
        messagesRes.json(),
        usersRes.json()
      ]);

      // Combine data
      const enrichedMessages = messagesData.map((message: any) => {
        // Find sender by userId matching senderId
        const sender = usersData.find((u: any) => u.userId === message.senderId);
        
        // Find receiver by userId matching receiverId (if exists) or hostId/tenantId
        let receiver = null;
        if (message.receiverId) {
          receiver = usersData.find((u: any) => u.userId === message.receiverId);
        } else {
          // If no receiverId, try to find by hostId or tenantId (whoever is not the sender)
          if (message.senderId === message.hostId) {
            receiver = usersData.find((u: any) => u.userId === message.tenantId);
          } else {
            receiver = usersData.find((u: any) => u.userId === message.hostId);
          }
        }

        return {
          ...message,
          sender: sender || { 
            fullName: 'Người dùng không tồn tại', 
            email: 'unknown@example.com' 
          },
          receiver: receiver || { 
            fullName: 'Người nhận không tồn tại', 
            email: 'unknown@example.com' 
          }
        };
      });

      // Apply filters
      let filteredMessages = enrichedMessages;

      if (filters) {
        if (filters.isRead !== undefined && filters.isRead !== 'all') {
          filteredMessages = filteredMessages.filter((message: Message) => 
            message.isRead === filters.isRead
          );
        }
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredMessages = filteredMessages.filter((message: Message) => 
            message.message.toLowerCase().includes(searchLower) ||
            message.sender?.fullName.toLowerCase().includes(searchLower) ||
            message.receiver?.fullName.toLowerCase().includes(searchLower)
          );
        }
      }

      return filteredMessages.sort((a: Message, b: Message) => 
        new Date(b.time).getTime() - new Date(a.time).getTime()
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Không thể tải danh sách tin nhắn');
    }
  }

  async getMessageById(id: string): Promise<Message> {
    try {
      const messages = await this.getMessages();
      const message = messages.find(m => m.id === id);
      
      if (!message) {
        throw new Error('Message not found');
      }

      return message;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw new Error('Không thể tải thông tin tin nhắn');
    }
  }

  async sendMessage(messageData: CreateMessageData): Promise<Message> {
    try {
      const newMessage = {
        id: Date.now().toString(),
        messageId: `MSG${Date.now()}`,
        ...messageData,
        receiverId: messageData.receiverId || (messageData.senderId === messageData.hostId ? messageData.tenantId : messageData.hostId),
        time: messageData.time || new Date().toISOString(),
        isRead: messageData.isRead || false
      };

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const createdMessage = await response.json();
      
      // Get enriched message data
      const messages = await this.getMessages();
      return messages.find(m => m.id === createdMessage.id) || createdMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Không thể gửi tin nhắn');
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw new Error('Không thể đánh dấu tin nhắn đã đọc');
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Không thể xóa tin nhắn');
    }
  }

  async getMessageStats(): Promise<MessageStats> {
    try {
      const messages = await this.getMessages();
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats: MessageStats = {
        total: messages.length,
        unread: messages.filter(m => !m.isRead).length,
        today: messages.filter(m => new Date(m.time) >= today).length,
        thisWeek: messages.filter(m => new Date(m.time) >= weekAgo).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw new Error('Không thể tải thống kê tin nhắn');
    }
  }
}

export const messageService = new MessageService();