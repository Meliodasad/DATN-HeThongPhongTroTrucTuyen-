import type { User, UserFormData, UserStats } from '../types/user';
import { mockUsers, delay } from '../utils/mockData';

class UserService {
  private users: User[] = [...mockUsers];

  async getUsers(): Promise<User[]> {
    await delay(500); // Simulate network delay
    return [...this.users].sort((a, b) => a.id - b.id);
  }

  async getUserById(id: number): Promise<User | undefined> {
    await delay(300);
    return this.users.find(user => user.id === id);
  }

  async createUser(userData: UserFormData): Promise<User> {
    await delay(600);
    
    const newUser: User = {
      id: Math.max(...this.users.map(u => u.id)) + 1,
      ...userData,
      role: userData.role as User['role'],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400`
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<UserFormData>): Promise<User> {
    await delay(600);
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      role: userData.role as User['role'] || this.users[userIndex].role
    };

    return this.users[userIndex];
  }

  async deleteUser(id: number): Promise<void> {
    await delay(400);
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users.splice(userIndex, 1);
  }

  async toggleUserStatus(id: number): Promise<User> {
    await delay(300);
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex].status = this.users[userIndex].status === 'active' ? 'inactive' : 'active';
    return this.users[userIndex];
  }

  async getUserStats(): Promise<UserStats> {
    await delay(200);
    
    const total = this.users.length;
    const active = this.users.filter(u => u.status === 'active').length;
    const inactive = total - active;
    
    const byRole = this.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<User['role'], number>);

    return { total, active, inactive, byRole };
  }
}

export const userService = new UserService();