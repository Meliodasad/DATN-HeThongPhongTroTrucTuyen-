import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
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
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value as User['role'] | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="Chủ trọ">Chủ trọ</option>
          <option value="Người dùng">Người dùng</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as User['status'] | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        {/* Add User Button */}
        <button
          onClick={onAddUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm người dùng
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;