import { useState, useEffect } from 'react';
import type { UserStats } from '../types/user';
import type { RoomStats } from '../types/room';

export const useStats = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: { 'Admin': 0, 'Chủ trọ': 0, 'Người dùng': 0 }
  });
  
  const [roomStats, setRoomStats] = useState<RoomStats>({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
    byType: { single: 0, shared: 0, apartment: 0, studio: 0 },
    averagePrice: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/db.json');
        const data = await response.json();
        
        // Calculate user stats
        const users = data.users || [];
        const userStatsData: UserStats = {
          total: users.length,
          active: users.filter((u: any) => u.status === 'active').length,
          inactive: users.filter((u: any) => u.status === 'inactive').length,
          byRole: {
            'Admin': users.filter((u: any) => u.role === 'Admin').length,
            'Chủ trọ': users.filter((u: any) => u.role === 'Chủ trọ').length,
            'Người dùng': users.filter((u: any) => u.role === 'Người dùng').length
          }
        };

        // Calculate room stats
        const rooms = data.rooms || [];
        const totalRevenue = rooms
          .filter((r: any) => r.status === 'rented')
          .reduce((sum: number, room: any) => sum + room.price, 0);
        
        const roomStatsData: RoomStats = {
          total: rooms.length,
          available: rooms.filter((r: any) => r.status === 'available').length,
          rented: rooms.filter((r: any) => r.status === 'rented').length,
          maintenance: rooms.filter((r: any) => r.status === 'maintenance').length,
          byType: {
            single: rooms.filter((r: any) => r.type === 'single').length,
            shared: rooms.filter((r: any) => r.type === 'shared').length,
            apartment: rooms.filter((r: any) => r.type === 'apartment').length,
            studio: rooms.filter((r: any) => r.type === 'studio').length
          },
          averagePrice: rooms.length > 0 ? rooms.reduce((sum: number, room: any) => sum + room.price, 0) / rooms.length : 0,
          totalRevenue
        };

        setUserStats(userStatsData);
        setRoomStats(roomStatsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { userStats, roomStats, loading };
};