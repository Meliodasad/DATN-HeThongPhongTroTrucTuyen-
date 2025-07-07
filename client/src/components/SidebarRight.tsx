import React from 'react';

const SidebarRight = () => {

  const posts = [
    {
      title: 'Phòng trọ gần ĐH Bách Khoa',
      price: '2.5 triệu/tháng',
      time: '5 phút trước',
      image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/04/z6769772677769-ad10a93dd5adfbb856ab81457c55a907_1751609122.jpg',
    },
    {
      title: 'Căn hộ mini có ban công',
      price: '3.2 triệu/tháng',
      time: '10 phút trước',
      image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/04/1_1751604878.jpg',
    },
    {
      title: 'Phòng trọ mới xây sạch sẽ',
      price: '2 triệu/tháng',
      time: '15 phút trước',
      image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/04/1_1751603761.jpg',
    },
    {
      title: 'Phòng trọ mới xây sạch sẽ',
      price: '2 triệu/tháng',
      time: '15 phút trước',
      image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/04/1_1751603761.jpg',
    },
    {
      title: 'Phòng trọ mới xây sạch sẽ',
      price: '2 triệu/tháng',
      time: '15 phút trước',
      image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/04/1_1751603761.jpg',
    },
    {
      title: 'Phòng trọ mới xây sạch sẽ',
      price: '2 triệu/tháng',
      time: '15 phút trước',
      image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/04/1_1751603761.jpg',
    },
  ];

  return (

    <div style={{ padding: 16, background: '#fff' }}>

      <div>
        <div>
          <h4 style={{ fontSize: 16 }}>Xem khoảng giá</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ width: '50%' }}>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Dưới 1 triệu</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Từ 2 - 3 triệu</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black'}}>Từ 5 - 7 triệu</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black'}}>Từ 10 - 15 triệu</a>
              </p>
            </div>
            <div style={{ width: '50%' }}>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Từ 1 - 2 triệu</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Từ 3 - 5 triệu</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Từ 7 - 10 triệu</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Trên 15 triệu</a>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 16}}>Xem diện tích</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ width: '50%' }}>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Dưới 20 m²</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black'}}>Từ 30 - 50m²</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black'}}>Từ 70 - 90m²</a>
              </p>
            </div>
            <div style={{ width: '50%' }}>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Từ 20 - 30m²</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black'}}>Từ 50 - 70m²</a>
              </p>
              <p style={{ margin: '6px 0' }}>
                <span style={{ color: 'orange' }}>›</span>{' '}
                <a href="#" style={{ color: 'black' }}>Trên 90m²</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontWeight: 'bold', marginBottom: 12 }}>Tin mới đăng</p>
      {posts.map((post, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <img src={post.image} alt="post" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 14 }}>{post.title}</div>
            <div style={{ fontSize: 13 }}>{post.price}</div>
            <div style={{ fontSize: 12 }}>{post.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarRight;
