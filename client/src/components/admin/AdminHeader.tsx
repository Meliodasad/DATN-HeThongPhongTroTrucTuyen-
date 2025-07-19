import React from 'react';
import { Search, UserCircle2 } from 'lucide-react';

const AdminHeader = () => {
  return (
    <header className="bg-white w-full shadow-md flex items-center px-6 py-3 relative z-50">
      {/* Logo */}
      <div className="w-1/5 text-lg font-bold text-blue-600">Bùi Xuân Tùng</div>

      {/* Right header */}
      <div className="w-4/5 flex justify-between items-center">
        {/* Search */}
        <form className="relative w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="border border-gray-300 rounded-md w-full pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            placeholder="Tìm kiếm..."
          />
        </form>

        {/* User Info */}
        <ul className="flex items-center gap-3">
          <li className="text-sm text-gray-700">Xin chào, <strong>Admin</strong></li>
          <li>
            <UserCircle2 size={28} className="text-blue-600" />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default AdminHeader;
