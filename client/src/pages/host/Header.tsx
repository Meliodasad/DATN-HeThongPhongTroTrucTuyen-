import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ padding: "1rem", background: "#f5f5f5" }}>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/host/profile">Thông tin cá nhân</Link>
        <Link to="/host/room-status">Trạng thái phòng</Link>
        <Link to="/host/rental-requests">Yêu cầu thuê</Link>
        <Link to="/host/tenant-list">DS người thuê</Link>
        <Link to="/host/contract-history">Hợp đồng</Link>
        <Link to="/host/revenue-stats">Thống kê</Link>
        <Link to="/host/logout">Đăng xuất</Link>
      </nav>
    </header>
  );
};
export default Header;