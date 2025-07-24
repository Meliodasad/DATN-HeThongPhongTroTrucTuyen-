import { apiService } from './api';
import type { User, UserFormData, UserStats } from '../types/user';

class UserService {
  // Lấy tất cả người dùng
  async getUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users');
  }

  // Lấy người dùng theo ID
  async getUserById(id: number | string): Promise<User> {
    return apiService.get<User>(`/users/${id}`);
  }

  // Tạo người dùng mới
  async createUser(userData: UserFormData): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`
    };

    return apiService.post<User>('/users', newUser);
  }

  // Cập nhật thông tin người dùng
  async updateUser(id: number | string, userData: Partial<UserFormData>): Promise<User> {
    return apiService.patch<User>(`/users/${id}`, userData);
  }

  // Xóa người dùng
  async deleteUser(id: number | string): Promise<void> {
    return apiService.delete<void>(`/users/${id}`);
  }

  // Chuyển trạng thái active/inactive
  async toggleUserStatus(id: number | string): Promise<User> {
    const user = await this.getUserById(id);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    return apiService.patch<User>(`/users/${id}`, { status: newStatus });
  }

  // Thống kê người dùng
  async getUserStats(): Promise<UserStats> {
    const users = await this.getUsers();

    const stats: UserStats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      byRole: {
        Admin: users.filter(u => u.role === 'Admin').length,
        'Chủ trọ': users.filter(u => u.role === 'Chủ trọ').length,
        'Người dùng': users.filter(u => u.role === 'Người dùng').length
      }
    };

    return stats;
  }
}

export const userService = new UserService();
