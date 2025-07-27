import type { CreateUserData, UpdateUserData, User, UserFilters, UserStats } from "../types/user";

class UserService {
private baseUrl = 'http://localhost:5000';

  async getUsers(filters?: UserFilters): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      let users = await response.json();

      // Apply filters
      if (filters) {
        if (filters.role && filters.role !== 'all') {
          users = users.filter((user: User) => user.role === filters.role);
        }
        if (filters.status && filters.status !== 'all') {
          users = users.filter((user: User) => user.status === filters.status);
        }
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          users = users.filter((user: User) => 
            user.fullName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            (user.phone && user.phone.includes(filters.searchTerm!))
          );
        }
        if (filters.dateFrom) {
          users = users.filter((user: User) => 
            new Date(user.createdAt) >= new Date(filters.dateFrom!)
          );
        }
        if (filters.dateTo) {
          users = users.filter((user: User) => 
            new Date(user.createdAt) <= new Date(filters.dateTo!)
          );
        }
      }

      return users.sort((a: User, b: User) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Không thể tải danh sách người dùng');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Không thể tải thông tin người dùng');
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        status: 'active' as const,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Không thể tạo người dùng mới');
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Không thể cập nhật thông tin người dùng');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Không thể xóa người dùng');
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const users = await this.getUsers();
      
      const stats: UserStats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        pending: users.filter(u => u.status === 'pending').length,
        admins: users.filter(u => u.role === 'admin').length,
        hosts: users.filter(u => u.role === 'host').length,
        tenants: users.filter(u => u.role === 'tenant').length,
        guests: users.filter(u => u.role === 'guest').length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Không thể tải thống kê người dùng');
    }
  }

  async updateUserStatus(id: string, status: User['status']): Promise<void> {
    try {
      await this.updateUser(id, { status });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw new Error('Không thể cập nhật trạng thái người dùng');
    }
  }
}

export const userService = new UserService();