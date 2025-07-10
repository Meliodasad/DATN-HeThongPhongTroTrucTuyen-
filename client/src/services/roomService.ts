import type { Room, RoomFormData, RoomStats } from '../types/room';
import { mockRooms, delay } from '../utils/roomMockData';

class RoomService {
  private rooms: Room[] = [...mockRooms];

  async getRooms(): Promise<Room[]> {
    await delay(500);
    return [...this.rooms].sort((a, b) => b.id - a.id);
  }

  async getRoomById(id: number): Promise<Room | undefined> {
    await delay(300);
    return this.rooms.find(room => room.id === id);
  }

  async createRoom(roomData: RoomFormData): Promise<Room> {
    await delay(600);
    
    const newRoom: Room = {
      id: Math.max(...this.rooms.map(r => r.id)) + 1,
      ...roomData,
      roomType: roomData.roomType as Room['roomType'],
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      landlordName: this.getLandlordName(roomData.landlordId),
      landlordPhone: this.getLandlordPhone(roomData.landlordId),
      landlordEmail: this.getLandlordEmail(roomData.landlordId)
    };

    this.rooms.push(newRoom);
    return newRoom;
  }

  async updateRoom(id: number, roomData: Partial<RoomFormData>): Promise<Room> {
    await delay(600);
    
    const roomIndex = this.rooms.findIndex(room => room.id === id);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    this.rooms[roomIndex] = {
      ...this.rooms[roomIndex],
      ...roomData,
      roomType: roomData.roomType as Room['roomType'] || this.rooms[roomIndex].roomType,
      updatedAt: new Date().toISOString().split('T')[0],
      landlordName: roomData.landlordId ? this.getLandlordName(roomData.landlordId) : this.rooms[roomIndex].landlordName,
      landlordPhone: roomData.landlordId ? this.getLandlordPhone(roomData.landlordId) : this.rooms[roomIndex].landlordPhone,
      landlordEmail: roomData.landlordId ? this.getLandlordEmail(roomData.landlordId) : this.rooms[roomIndex].landlordEmail
    };

    return this.rooms[roomIndex];
  }

  async deleteRoom(id: number): Promise<void> {
    await delay(400);
    
    const roomIndex = this.rooms.findIndex(room => room.id === id);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    this.rooms.splice(roomIndex, 1);
  }

  async updateRoomStatus(id: number, status: Room['status']): Promise<Room> {
    await delay(300);
    
    const roomIndex = this.rooms.findIndex(room => room.id === id);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    this.rooms[roomIndex].status = status;
    this.rooms[roomIndex].updatedAt = new Date().toISOString().split('T')[0];
    return this.rooms[roomIndex];
  }

  async getRoomStats(): Promise<RoomStats> {
    await delay(200);
    
    const total = this.rooms.length;
    const available = this.rooms.filter(r => r.status === 'available').length;
    const rented = this.rooms.filter(r => r.status === 'rented').length;
    const maintenance = this.rooms.filter(r => r.status === 'maintenance').length;
    
    const byType = this.rooms.reduce((acc, room) => {
      acc[room.roomType] = (acc[room.roomType] || 0) + 1;
      return acc;
    }, {} as Record<Room['roomType'], number>);

    const averagePrice = this.rooms.length > 0 
      ? Math.round(this.rooms.reduce((sum, room) => sum + room.price, 0) / this.rooms.length)
      : 0;

    const totalRevenue = this.rooms
      .filter(room => room.status === 'rented')
      .reduce((sum, room) => sum + room.price, 0);

    return { total, available, rented, maintenance, byType, averagePrice, totalRevenue };
  }

  private getLandlordName(landlordId: number): string {
    const landlords: { [key: number]: string } = {
      1: 'Nguyễn Văn Admin',
      2: 'Trần Thị Lan',
      4: 'Phạm Thị Hoa'
    };
    return landlords[landlordId] || 'Chưa xác định';
  }

  private getLandlordPhone(landlordId: number): string {
    const phones: { [key: number]: string } = {
      1: '0900000000',
      2: '0901234567',
      4: '0912345678'
    };
    return phones[landlordId] || '0000000000';
  }

  private getLandlordEmail(landlordId: number): string {
    const emails: { [key: number]: string } = {
      1: 'admin@example.com',
      2: 'lan.tran@example.com',
      4: 'hoa.pham@example.com'
    };
    return emails[landlordId] || 'unknown@example.com';
  }
}

export const roomService = new RoomService();