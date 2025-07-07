import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#f3f4f6',
      padding: '0px 10px',
      textAlign: 'center',
      fontSize: 14,
      color: '#555',
      marginTop: 40
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h4 style={{ marginBottom: 8, fontWeight: 'bold', color: '#222' }}>
          Phòng Trọ  123
        </h4>
        <p>Website tìm kiếm và đăng tin thuê phòng trọ dễ dàng, nhanh chóng.</p>

        <div style={{ marginTop: 16, lineHeight: 1.8 }}>
          📧 Email:{' '}
          <a href="mailto:phongtro@gmail.com" style={{ color: '#555', textDecoration: 'none' }}>
            phongtro@gmail.com
          </a>
          <br />
          ☎️ Hotline:{' '}
          <a href="tel:0123456789" style={{ color: '#555', textDecoration: 'none' }}>
            0976588888
          </a>
        </div>

        <p style={{ fontSize: 13, color: '#999', marginTop: 24 }}>
          © 2025 Phongtro. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
