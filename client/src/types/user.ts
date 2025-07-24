export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Chủ trọ' | 'Người dùng';
<<<<<<< HEAD
  password: string;
  createdAt: string;
  avatar?: string;
  status: 'active' | 'inactive';
=======
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
>>>>>>> xuan-tung
}

export interface UserFormData {
  name: string;
  email: string;
<<<<<<< HEAD
  role: User['role'] | '';
  password: string;
=======
  role: 'Admin' | 'Chủ trọ' | 'Người dùng';
  status: 'active' | 'inactive';
>>>>>>> xuan-tung
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
<<<<<<< HEAD
  byRole: Record<User['role'], number>;
=======
  byRole: {
    'Admin': number;
    'Chủ trọ': number;
    'Người dùng': number;
  };
>>>>>>> xuan-tung
}