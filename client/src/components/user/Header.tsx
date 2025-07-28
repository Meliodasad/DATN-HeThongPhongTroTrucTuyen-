import React from 'react';
import '../../css/Header.css'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <img
            src="https://phongtro123.com/images/logo-phongtro.svg"
            alt="Logo"
            className="logo"
          />
          <input
            type="text"
            placeholder="Tìm phòng theo khu vực..."
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <button className="btn">Tin đã lưu</button>
          <Link to="/register" className="btn">Đăng ký</Link>
          <Link to="/login" className="btn">Đăng nhập</Link>
          <button className="btn highlight">Đăng tin</button>
        </div>
      </div>

      <nav className="header-nav">
        <div className="nav-links">
          <a href="#">Phòng trọ</a>
          <a href="#">Nhà nguyên căn</a>
          <a href="#">Căn hộ</a>
          <a href="#">Ở ghép</a>
          <a href="#">Mặt bằng</a>
          <a href="#">Blog</a>
          <a href="#">Bảng giá dịch vụ</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
