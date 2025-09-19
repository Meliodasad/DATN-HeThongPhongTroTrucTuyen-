import { useState, useRef, useEffect } from 'react';
import '../../css/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSearch } from '../../contexts/SearchContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { setSearchRoom } = useSearch();
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
            onClick={() => {
              navigate('/');
              setSearchRoom({});
            }}
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
                <span className="text-white">{user?.username}</span>
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
          <a onClick={() => setSearchRoom((pre: any) => ({ ...pre, roomType: 'room' }))}>Phòng trọ</a>
          <a onClick={() => setSearchRoom((pre: any) => ({ ...pre, roomType: 'house' }))}>Nhà nguyên căn</a>
          <a onClick={() => setSearchRoom((pre: any) => ({ ...pre, roomType: 'apartment' }))}>Căn hộ</a>
          <a onClick={() => setSearchRoom((pre: any) => ({ ...pre, roomType: 'shared' }))}>Ở ghép</a>
          <a onClick={() => setSearchRoom((pre: any) => ({ ...pre, roomType: 'commercial' }))}>Mặt bằng</a>
          <a onClick={() => setSearchRoom((pre: any) => ({ ...pre, roomType: 'blog' }))}>Blog</a>
          <a onClick={() => setSearchRoom((pre: any) => ({ ...pre, roomType: 'service_price' }))}>Bảng giá dịch vụ</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
