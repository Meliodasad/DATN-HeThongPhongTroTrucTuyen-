import React from 'react'

const Header = () => {
  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      width: '100%',
      top: 0,
      padding: '8px 16px',
      zIndex: 1000,      
      left: 0,
    }}>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', 
        padding: '8px 32px', 
        width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src="https://phongtro123.com/images/logo-phongtro.svg"
            alt="Logo"
            style={{ height: 30 }}
          />
          <input
            type="text"
            placeholder="Tìm phòng theo khu vực..."
            style={{
              width: 400,
              borderRadius: 20,
              padding: '8px 16px',
              border: '1px solid #ccc',
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, fontSize: 14 , width:'100%', alignItems:"center", padding: '8px 200px'}}>
          <button style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>Tin đã lưu</button>
          <button style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>Đăng ký</button>
          <button style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>Đăng nhập</button>
          <button style={{ backgroundColor: '#f97316', color: 'white',border: 'none',borderRadius: 6,padding: '6px 16px',cursor: 'pointer'}}>
            Đăng tin
          </button>
        </div>
      </div>

      <nav style={{
        backgroundColor: 'white',
        borderTop: '1px solid #ddd',
        borderBottom: '1px solid #ddd',
        fontSize: 14,
        padding: '8px 32px', 
      }}>
        <div style={{
          display: 'flex',
          gap: 24,
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <a href="#" style={{ color: '#555' }}>Phòng trọ</a>
          <a href="#" style={{ color: '#555' }}>Nhà nguyên căn</a>
          <a href="#" style={{ color: '#555' }}>Căn hộ</a>
          <a href="#" style={{ color: '#555' }}>Ở ghép</a>
          <a href="#" style={{ color: '#555' }}>Mặt bằng</a>
          <a href="#" style={{ color: '#555' }}>Blog</a>
          <a href="#" style={{ color: '#555' }}>Bảng giá dịch vụ</a>
        </div>
      </nav>
    </header>
  )
}

export default Header
