import React from 'react';
import '../../css/SidebarLeft.css';
import db from '../../../db.json';

const SidebarLeft = () => {
  // optional chaining + fallback 0
  const roomCount = db.rooms?.length ?? 0;

  return (
    <div className="sidebar-left-container">
      <h2 className="sidebar-left-title">
        Kênh thông tin Phòng Trọ số 1 Việt Nam
      </h2>

      <p className="sidebar-left-subtitle">
        Có {roomCount.toLocaleString()} tin đăng cho thuê
      </p>

      <p className="sidebar-left-bold-text">TỈNH THÀNH</p>

      <div className="sidebar-left-buttons">
        <button className="sidebar-left-button">Phòng trọ Hồ Chí Minh</button>
        <button className="sidebar-left-button">Phòng trọ Hà Nội</button>
        <button className="sidebar-left-button">Phòng trọ Đà Nẵng</button>
        <button className="sidebar-left-button all">
          Tất cả <span>›</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarLeft;
