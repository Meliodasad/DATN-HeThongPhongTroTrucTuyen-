import type { Room } from '../types/room';

const API_BASE_URL = 'http://localhost:3000';

export const roomService = {
  async getRooms(): Promise<Room[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  async getRoomById(id: string): Promise<Room> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch room');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  },

  async createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'approved'>): Promise<Room> {
    try {
      // Get all existing rooms to determine the next sequential ID
      const existingRooms = await this.getRooms();
      
      // Find the highest existing ID (as string) and increment by 1
      const maxId = existingRooms.length > 0 
        ? Math.max(...existingRooms.map(room => {
            const id = parseInt(room.id);
            return isNaN(id) ? 0 : id;
          }))
        : 0;
      
      const nextId = (maxId + 1).toString();
      
      const now = new Date().toISOString();
      const newRoom: Room = {
        ...roomData,
        id: nextId,
        status: 'pending', // Mặc định là chờ duyệt
        approved: false,
        createdAt: now,
        updatedAt: now
      };

      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  async updateRoom(id: string, roomData: Partial<Room>): Promise<Room> {
    try {
      const updatedRoom = {
        ...roomData,
        id,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoom),
      });

      if (!response.ok) {
        throw new Error('Failed to update room');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  async deleteRoom(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  async approveRoom(id: string, approvedBy: string): Promise<Room> {
    try {
      const room = await this.getRoomById(id);
      const updatedRoom = {
        ...room,
        status: 'available' as Room['status'],
        approved: true,
        approvedBy,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoom),
      });

      if (!response.ok) {
        throw new Error('Failed to approve room');
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving room:', error);
      throw error;
    }
  },

  async rejectRoom(id: string, rejectionReason: string, rejectedBy: string): Promise<Room> {
    try {
      const room = await this.getRoomById(id);
      const updatedRoom = {
        ...room,
        status: 'rejected' as Room['status'],
        approved: false,
        rejectionReason,
        approvedBy: rejectedBy,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoom),
      });

      if (!response.ok) {
        throw new Error('Failed to reject room');
      }

      return await response.json();
    } catch (error) {
      console.error('Error rejecting room:', error);
      throw error;
    }
  },

  async getRoomStats(): Promise<any> {
    try {
      const rooms = await this.getRooms();
      
      const stats = {
        total: rooms.length,
        available: rooms.filter(r => r.status === 'available').length,
        rented: rooms.filter(r => r.status === 'rented').length,
        maintenance: rooms.filter(r => r.status === 'maintenance').length,
        pending: rooms.filter(r => r.status === 'pending').length,
        rejected: rooms.filter(r => r.status === 'rejected').length,
        byType: {
          single: rooms.filter(r => r.type === 'single').length,
          shared: rooms.filter(r => r.type === 'shared').length,
          apartment: rooms.filter(r => r.type === 'apartment').length,
          studio: rooms.filter(r => r.type === 'studio').length,
        },
        averagePrice: rooms.length > 0 ? rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length : 0,
        totalRevenue: rooms.filter(r => r.status === 'rented').reduce((sum, r) => sum + r.price, 0)
      };

      return stats;
    } catch (error) {
      console.error('Error getting room stats:', error);
      throw error;
    }
  },

  async updateRoomStatus(id: string, status: Room['status']): Promise<Room> {
    try {
      const room = await this.getRoomById(id);
      return await this.updateRoom(id, { ...room, status });
    } catch (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
  }
};