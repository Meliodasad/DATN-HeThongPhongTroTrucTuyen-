import React from 'react';
import { Search, Plus } from 'lucide-react';
import type { User } from '../../../types/user'; 
interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: User['role'] | 'all';
  onRoleFilterChange: (value: User['role'] | 'all') => void;
  statusFilter: User['status'] | 'all';
  onStatusFilterChange: (value: User['status'] | 'all') => void;
  onAddUser: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onAddUser
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value as User['role'] | 'all')}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="Admin">Admin</option>
              <option value="Chủ trọ">Chủ trọ</option>
              <option value="Người dùng">Người dùng</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as User['status'] | 'all')}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={onAddUser}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
        >
          <Plus size={20} />
          Thêm người dùng
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;