import React, { useState, useRef, useEffect } from 'react';
import '../../css/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <img
            src="https://phongtro123.com/images/logo-phongtro.svg"
            alt="Logo"
            className="logo"
            onClick={() => navigate('/')}
          />
          <input
            type="text"
            placeholder="Tìm phòng theo khu vực..."
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <button className="btn">Tin đã lưu</button>

          {user ? (
            <div
              className="user-dropdown"
              ref={dropdownRef}
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar || 'https://i.pravatar.cc/40'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white">{user.username}</span>
              </div>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/my-account" onClick={() => setShowDropdown(false)}>
                    Tài khoản của tôi
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/register" className="btn">
                Đăng ký
              </Link>
              <Link to="/login" className="btn">
                Đăng nhập
              </Link>
            </>
          )}

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
