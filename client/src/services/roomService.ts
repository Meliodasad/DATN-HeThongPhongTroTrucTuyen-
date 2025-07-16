import { apiService } from './api';
import type { Room, RoomFormData, RoomStats } from '../types/room';

class RoomService {
  // Get all rooms
  async getRooms(): Promise<Room[]> {
    return apiService.get<Room[]>('/rooms');
  }

  // Get room by ID
  async getRoomById(id: number): Promise<Room> {
    return apiService.get<Room>(`/rooms/${id}`);
  }

  // Create new room
  async createRoom(roomData: RoomFormData): Promise<Room> {
    const newRoom = {
      ...roomData,
      id: Date.now(), // Temporary ID generation
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return apiService.post<Room>('/rooms', newRoom);
  }

  // Update room
  async updateRoom(id: number, roomData: RoomFormData): Promise<Room> {
    const updatedRoom = {
      ...roomData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return apiService.put<Room>(`/rooms/${id}`, updatedRoom);
  }

  // Delete room
  async deleteRoom(id: number): Promise<void> {
    return apiService.delete<void>(`/rooms/${id}`);
  }

  // Update room status
  async updateRoomStatus(id: number, status: Room['status']): Promise<Room> {
    return apiService.patch<Room>(`/rooms/${id}`, { 
      status,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  }

  // Get room statistics
  async getRoomStats(): Promise<RoomStats> {
    const rooms = await this.getRooms();
    
    const totalRevenue = rooms
      .filter(r => r.status === 'rented')
      .reduce((sum, room) => sum + room.price, 0);
    
    const stats: RoomStats = {
      total: rooms.length,
      available: rooms.filter(r => r.status === 'available').length,
      rented: rooms.filter(r => r.status === 'rented').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length,
      byType: {
        single: rooms.filter(r => r.type === 'single').length,
        shared: rooms.filter(r => r.type === 'shared').length,
        apartment: rooms.filter(r => r.type === 'apartment').length,
        studio: rooms.filter(r => r.type === 'studio').length
      },
      averagePrice: rooms.length > 0 ? Math.round(rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length) : 0,
      totalRevenue
    };

    return stats;
  }
}

export const roomService = new RoomService();