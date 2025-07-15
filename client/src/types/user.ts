export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Chủ trọ' | 'Người dùng';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'Admin' | 'Chủ trọ' | 'Người dùng';
  status: 'active' | 'inactive';
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    'Admin': number;
    'Chủ trọ': number;
    'Người dùng': number;
  };
}