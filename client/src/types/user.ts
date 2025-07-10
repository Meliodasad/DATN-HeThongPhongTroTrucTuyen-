export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Chủ trọ' | 'Người dùng';
  password: string;
  createdAt: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface UserFormData {
  name: string;
  email: string;
  role: User['role'] | '';
  password: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<User['role'], number>;
}