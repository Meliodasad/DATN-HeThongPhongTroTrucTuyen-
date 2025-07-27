import type { Message, MessageStats, MessageFilters } from '../types/message';

class MessageService {
private baseUrl = 'http://localhost:5000';

  async getMessages(filters?: MessageFilters): Promise<Message[]> {
    try {
      // Get messages with related data
      const messagesResponse = await fetch(`${this.baseUrl}/messages`);
      const messages = await messagesResponse.json();

      // Get users data
      const usersResponse = await fetch(`${this.baseUrl}/users`);
      const users = await usersResponse.json();

      // Combine data
      const enrichedMessages = messages.map((message: any) => {
        const sender = users.find((u: any) => u.id === message.senderId);
        const receiver = message.hostId === message.senderId 
          ? users.find((u: any) => u.id === message.tenantId)
          : users.find((u: any) => u.id === message.hostId);

        return {
          ...message,
          sender: sender || { fullName: 'Unknown', email: 'unknown@example.com' },
          receiver: receiver || { fullName: 'Unknown', email: 'unknown@example.com' }
        };
      });

      // Apply filters
      let filteredMessages = enrichedMessages;

      if (filters?.isRead !== undefined) {
        filteredMessages = filteredMessages.filter((message: Message) => message.isRead === filters.isRead);
      }

      if (filters?.senderId) {
        filteredMessages = filteredMessages.filter((message: Message) => message.senderId === filters.senderId);
      }

      if (filters?.receiverId) {
        filteredMessages = filteredMessages.filter((message: Message) => 
          message.hostId === filters.receiverId || message.tenantId === filters.receiverId
        );
      }

      return filteredMessages.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Không thể tải danh sách tin nhắn');
    }
  }

  async getMessageById(id: string): Promise<Message> {
    try {
      const messageResponse = await fetch(`${this.baseUrl}/messages/${id}`);
      if (!messageResponse.ok) {
        throw new Error('Message not found');
      }
      const message = await messageResponse.json();

      // Get users data
      const usersResponse = await fetch(`${this.baseUrl}/users`);
      const users = await usersResponse.json();

      const sender = users.find((u: any) => u.id === message.senderId);
      const receiver = message.hostId === message.senderId 
        ? users.find((u: any) => u.id === message.tenantId)
        : users.find((u: any) => u.id === message.hostId);

      return {
        ...message,
        sender: sender || { fullName: 'Unknown', email: 'unknown@example.com' },
        receiver: receiver || { fullName: 'Unknown', email: 'unknown@example.com' }
      };
    } catch (error) {
      console.error('Error fetching message:', error);
      throw new Error('Không thể tải chi tiết tin nhắn');
    }
  }

  async sendMessage(messageData: {
    hostId: string;
    tenantId: string;
    senderId: string;
    message: string;
    time: string;
    isRead: boolean;
  }): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          ...messageData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await response.json();
      return await this.getMessageById(newMessage.id);
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
      throw new Error('Không thể cập nhật trạng thái tin nhắn');
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

      const stats = {
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

  async getConversation(hostId: string, tenantId: string): Promise<Message[]> {
    try {
      const messages = await this.getMessages();
      
      return messages.filter(message => 
        (message.hostId === hostId && message.tenantId === tenantId) ||
        (message.hostId === tenantId && message.tenantId === hostId)
      ).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw new Error('Không thể tải cuộc trò chuyện');
    }
  }
}

export const messageService = new MessageService();