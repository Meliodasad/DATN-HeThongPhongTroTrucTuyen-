<<<<<<< HEAD
import type { Room, RoomFormData, RoomStats } from '../types/room';
=======
import type { CreateRoomData, Room, RoomFilters, RoomStats, UpdateRoomData } from "../types/room";
>>>>>>> origin/xuan-tung



class RoomService {
private baseUrl = 'http://localhost:5000';

  async getRooms(filters?: RoomFilters): Promise<Room[]> {
    try {
<<<<<<< HEAD
      const response = await fetch(`${API_BASE_URL}/rooms`);
      if (!response.ok) throw new Error('Failed to fetch rooms');
      return await response.json();
=======
      // Get rooms and users data
      const [roomsResponse, usersResponse] = await Promise.all([
        fetch(`${this.baseUrl}/rooms`),
        fetch(`${this.baseUrl}/users`)
      ]);

      if (!roomsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      let rooms = await roomsResponse.json();
      const users = await usersResponse.json();

      // Enrich rooms with host information
      rooms = rooms.map((room: any) => {
        const host = users.find((user: any) => user.id === room.hostId);
        return {
          ...room,
          host: host ? {
            fullName: host.fullName,
            email: host.email,
            phone: host.phone,
            avatar: host.avatar
          } : null
        };
      });

      // Apply filters
      if (filters) {
        if (filters.roomType && filters.roomType !== 'all') {
          rooms = rooms.filter((room: Room) => room.roomType === filters.roomType);
        }
        if (filters.status && filters.status !== 'all') {
          rooms = rooms.filter((room: Room) => room.status === filters.status);
        }
        if (filters.approvalStatus && filters.approvalStatus !== 'all') {
          rooms = rooms.filter((room: Room) => room.approvalStatus === filters.approvalStatus);
        }
        if (filters.hostId) {
          rooms = rooms.filter((room: Room) => room.hostId === filters.hostId);
        }
        if (filters.priceMin !== undefined) {
          rooms = rooms.filter((room: Room) => room.price >= filters.priceMin!);
        }
        if (filters.priceMax !== undefined) {
          rooms = rooms.filter((room: Room) => room.price <= filters.priceMax!);
        }
        if (filters.location) {
          rooms = rooms.filter((room: Room) => 
            room.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          rooms = rooms.filter((room: Room) => 
            room.roomTitle.toLowerCase().includes(searchLower) ||
            room.location.toLowerCase().includes(searchLower) ||
            room.description.toLowerCase().includes(searchLower)
          );
        }
      }

      return rooms.sort((a: Room, b: Room) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
>>>>>>> origin/xuan-tung
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw new Error('Không thể tải danh sách phòng trọ');
    }
  }

  async getRoomById(id: string | number): Promise<Room> {
    try {
<<<<<<< HEAD
      const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
      if (!response.ok) throw new Error('Failed to fetch room');
      return await response.json();
=======
      const [roomResponse, usersResponse] = await Promise.all([
        fetch(`${this.baseUrl}/rooms/${id}`),
        fetch(`${this.baseUrl}/users`)
      ]);

      if (!roomResponse.ok) {
        throw new Error('Room not found');
      }

      const room = await roomResponse.json();
      const users = await usersResponse.json();
      const host = users.find((user: any) => user.id === room.hostId);

      return {
        ...room,
        host: host ? {
          fullName: host.fullName,
          email: host.email,
          phone: host.phone,
          avatar: host.avatar
        } : null
      };
>>>>>>> origin/xuan-tung
    } catch (error) {
      console.error('Error fetching room:', error);
      throw new Error('Không thể tải thông tin phòng trọ');
    }
  }

<<<<<<< HEAD
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
=======
  async createRoom(roomData: CreateRoomData): Promise<Room> {
    try {
      const newRoom = {
        id: Date.now().toString(),
        ...roomData,
        status: 'available' as const,
        approvalStatus: 'pending' as const,
        createdAt: new Date().toISOString()
>>>>>>> origin/xuan-tung
      };

      const response = await fetch(`${this.baseUrl}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) throw new Error('Failed to create room');
      return await response.json();
    } catch (error) {
      console.error('Error creating room:', error);
      throw new Error('Không thể tạo phòng trọ mới');
    }
  }

<<<<<<< HEAD
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
=======
  async updateRoom(id: string, roomData: UpdateRoomData): Promise<Room> {
    try {
      const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
>>>>>>> origin/xuan-tung
      });

      if (!response.ok) throw new Error('Failed to update room');
      return await response.json();
    } catch (error) {
      console.error('Error updating room:', error);
      throw new Error('Không thể cập nhật thông tin phòng trọ');
    }
  }

  async deleteRoom(id: string | number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete room');
    } catch (error) {
      console.error('Error deleting room:', error);
      throw new Error('Không thể xóa phòng trọ');
    }
  }

<<<<<<< HEAD
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
=======
  async getRoomStats(): Promise<RoomStats> {
    try {
      const rooms = await this.getRooms();
      
      const stats: RoomStats = {
        total: rooms.length,
        available: rooms.filter(r => r.status === 'available').length,
        rented: rooms.filter(r => r.status === 'rented').length,
        maintenance: rooms.filter(r => r.status === 'maintenance').length,
        pending: rooms.filter(r => r.approvalStatus === 'pending').length,
        approved: rooms.filter(r => r.approvalStatus === 'approved').length,
        rejected: rooms.filter(r => r.approvalStatus === 'rejected').length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching room stats:', error);
      throw new Error('Không thể tải thống kê phòng trọ');
>>>>>>> origin/xuan-tung
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
<<<<<<< HEAD
};
=======

  async updateRoomStatus(id: string, status: Room['status']): Promise<void> {
    try {
      await this.updateRoom(id, { status });
    } catch (error) {
      console.error('Error updating room status:', error);
      throw new Error('Không thể cập nhật trạng thái phòng trọ');
    }
  }

  async updateApprovalStatus(id: string, approvalStatus: Room['approvalStatus']): Promise<void> {
    try {
      const updateData: UpdateRoomData = { 
        approvalStatus,
        ...(approvalStatus === 'approved' && { approvalDate: new Date().toISOString() })
      };
      await this.updateRoom(id, updateData);
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw new Error('Không thể cập nhật trạng thái duyệt');
    }
  }
}

export const roomService = new RoomService();
>>>>>>> origin/xuan-tung
