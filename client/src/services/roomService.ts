import type { Room, RoomFormData, RoomStats } from '../types/room';

const API_BASE_URL = 'http://localhost:3000';

export const roomService = {
  async getRooms(): Promise<Room[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);
      if (!response.ok) throw new Error('Failed to fetch rooms');
      return await response.json();
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  async getRoomById(id: string | number): Promise<Room> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
      if (!response.ok) throw new Error('Failed to fetch room');
      return await response.json();
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  },

  async createRoom(roomData: RoomFormData): Promise<Room> {
    try {
      const now = new Date().toISOString();
      const newRoom: Room = {
        ...roomData,
        id: Date.now(),
        createdAt: now,
        updatedAt: now,
        status: 'pending',
        approved: false,
      };

      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) throw new Error('Failed to create room');
      return await response.json();
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  async updateRoom(id: string | number, roomData: Partial<RoomFormData>): Promise<Room> {
    try {
      const updatedRoom = {
        ...roomData,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoom),
      });

      if (!response.ok) throw new Error('Failed to update room');
      return await response.json();
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  async deleteRoom(id: string | number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete room');
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  async approveRoom(id: string | number, approvedBy: string): Promise<Room> {
    try {
      const room = await this.getRoomById(id);
      const updatedRoom = {
        ...room,
        status: 'available' as Room['status'],
        approved: true,
        approvedBy,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return await this.updateRoom(id, updatedRoom);
    } catch (error) {
      console.error('Error approving room:', error);
      throw error;
    }
  },

  async rejectRoom(id: string | number, rejectionReason: string, rejectedBy: string): Promise<Room> {
    try {
      const room = await this.getRoomById(id);
      const updatedRoom = {
        ...room,
        status: 'rejected' as Room['status'],
        approved: false,
        rejectionReason,
        approvedBy: rejectedBy,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return await this.updateRoom(id, updatedRoom);
    } catch (error) {
      console.error('Error rejecting room:', error);
      throw error;
    }
  },

  async updateRoomStatus(id: string | number, status: Room['status']): Promise<Room> {
    try {
      const room = await this.getRoomById(id);
      return await this.updateRoom(id, { ...room, status });
    } catch (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
  },

  async getRoomStats(): Promise<RoomStats> {
    try {
      const rooms = await this.getRooms();

      const total = rooms.length;
      const available = rooms.filter(r => r.status === 'available').length;
      const rented = rooms.filter(r => r.status === 'rented').length;
      const maintenance = rooms.filter(r => r.status === 'maintenance').length;
      const byType = rooms.reduce((acc, room) => {
        const type = room.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const averagePrice = rooms.length > 0
        ? Math.round(rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length)
        : 0;

      const totalRevenue = rooms
        .filter(r => r.status === 'rented')
        .reduce((sum, r) => sum + r.price, 0);

      return { total, available, rented, maintenance, byType, averagePrice, totalRevenue };
    } catch (error) {
      console.error('Error getting room stats:', error);
      throw error;
    }
  }
};
