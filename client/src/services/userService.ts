import { apiService } from './api';
import type { User, UserFormData, UserStats } from '../types/user';

class UserService {
  // Get all users
  async getUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users');
  }

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    return apiService.get<User>(`/users/${id}`);
  }

  // Create new user
 // Create new user
async createUser(userData: UserFormData): Promise<User> {
  const newUser = {
    ...userData,
    id: Date.now().toString(), // ✅ Ép kiểu về string
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString().split('T')[0]
  };
  return apiService.post<User>('/users', newUser);
}

  // Update user
  async updateUser(id: number, userData: UserFormData): Promise<User> {
    return apiService.put<User>(`/users/${id}`, userData);
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    return apiService.delete<void>(`/users/${id}`);
  }

  // Toggle user status
  async toggleUserStatus(id: number): Promise<User> {
    const user = await this.getUserById(id);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    return apiService.patch<User>(`/users/${id}`, { status: newStatus });
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    const users = await this.getUsers();
    
    const stats: UserStats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      byRole: {
        'Admin': users.filter(u => u.role === 'Admin').length,
        'Chủ trọ': users.filter(u => u.role === 'Chủ trọ').length,
        'Người dùng': users.filter(u => u.role === 'Người dùng').length
      }
    };

    return stats;
  }
}

export const userService = new UserService();