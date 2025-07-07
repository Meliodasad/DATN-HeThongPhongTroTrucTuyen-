import React from 'react';

const SidebarLeft = () => {
  return (
    <div style={{ padding: '16px', backgroundColor: 'white' }}>
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>
        Kênh thông tin Phòng Trọ số 1 Việt Nam
      </h2>

      <p style={{ fontSize: 14, marginBottom: 16 }}>
        Có 1.456 tin đăng cho thuê
      </p>

      <p style={{ fontWeight: 'bold', marginBottom: 8 }}>TỈNH THÀNH</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button style={btnStyle}>Phòng trọ Hồ Chí Minh</button>
        <button style={btnStyle}>Phòng trọ Hà Nội</button>
        <button style={btnStyle}>Phòng trọ Đà Nẵng</button>
        <button style={btnStyle}>Phòng trọ Ninh Bình</button>
        <button style={{ ...btnStyle, backgroundColor: '#f1f5f9' }}>
          Tất cả <span style={{ fontWeight: 'bold' }}>›</span>
        </button>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: '6px 12px',
  fontSize: 14,
  borderRadius: 12,
  border: '1px solid #ccc',
  backgroundColor: 'white',
  cursor: 'pointer',
};

export default SidebarLeft;
