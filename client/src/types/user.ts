export interface User {
  
  id: string;
  fullName: string;
  email: string;
<<<<<<< HEAD
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
=======
  password: string;
  phone?: string;
  address?: string;
  idNumber?: string;
  dob?: string;
  role: 'admin' | 'host' | 'tenant' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  avatar?: string;
  otpCode?: string;
}

>>>>>>> origin/xuan-tung

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
<<<<<<< HEAD
<<<<<<< HEAD
  byRole: Record<User['role'], number>;
=======
  byRole: {
    'Admin': number;
    'Chủ trọ': number;
    'Người dùng': number;
  };
>>>>>>> xuan-tung
=======
  pending: number;
  admins: number;
  hosts: number;
  tenants: number;
  guests: number;
}

export interface UserFilters {
  role?: User['role'] | 'all';
  status?: User['status'] | 'all';
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  idNumber?: string;
  dob?: string;
  role: User['role'];
  avatar?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  status?: User['status'];
>>>>>>> origin/xuan-tung
}