// 📁 src/components/Header.tsx
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/host/profile", label: "Thông tin cá nhân" },
    { path: "/host/room-list", label: "Danh sách phòng của tôi" },
    { path: "/host/room-status", label: "Trạng thái phòng" },
    { path: "/host/rental-requests", label: "Yêu cầu thuê" },
    { path: "/host/create-contract", label: "Tạo hợp đồng" },
    { path: "/host/contracts", label: "Hợp đồng" },
    { path: "/host/logout", label: "Đăng xuất" },
  ];

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-4 justify-center md:justify-between items-center">
        <h1 className="text-lg font-semibold">🏠 Quản lý phòng trọ</h1>
        <nav className="flex flex-wrap gap-3 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1 rounded hover:bg-indigo-500 ${
                location.pathname === item.path ? "bg-white text-indigo-600 font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
