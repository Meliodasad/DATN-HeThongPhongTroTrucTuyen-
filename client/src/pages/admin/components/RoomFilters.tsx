import React from 'react';
import { Search, Plus, MapPin, Home, DollarSign, Maximize } from 'lucide-react';
import { vietnamDistricts } from '../../../utils/roomMockData';
import type { Room, RoomFilters } from '../../../types/room';

interface RoomFiltersProps {
  filters: RoomFilters;
  onFiltersChange: (filters: RoomFilters) => void;
  onAddRoom: () => void;
}

const RoomFiltersComponent: React.FC<RoomFiltersProps> = ({
  filters,
  onFiltersChange,
  onAddRoom
}) => {
  const handleFilterChange = (key: keyof RoomFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search and Add Button */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 lg:flex-none lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm phòng trọ (tên, địa chỉ, chủ trọ)..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <button
            onClick={onAddRoom}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm"
          >
            <Plus size={20} />
            Thêm phòng mới
          </button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* District Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">Tất cả quận</option>
              {vietnamDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Room Type Filter */}
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value as Room['roomType'] | 'all')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="all">Tất cả loại</option>
              <option value="single">Phòng đơn</option>
              <option value="shared">Phòng chia sẻ</option>
              <option value="apartment">Căn hộ</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value as Room['status'] | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Còn trống</option>
            <option value="rented">Đã thuê</option>
            <option value="maintenance">Bảo trì</option>
          </select>

          {/* Price Range */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="number"
              placeholder="Giá tối thiểu"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <input
            type="number"
            placeholder="Giá tối đa"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || 0)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />

          {/* Area Range */}
          <div className="relative">
            <Maximize className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="number"
              placeholder="Diện tích tối thiểu"
              value={filters.minArea || ''}
              onChange={(e) => handleFilterChange('minArea', Number(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFiltersComponent;