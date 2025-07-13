import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/SidebarRight.css';
import posts from '../../data/postsData';

const SidebarRight = () => {
  return (
    <div className="sidebar-container">

      <div className="sidebar-section">
        <h4>Xem khoảng giá</h4>
        <div className="price-area">
          <div>
            <p><span>›</span> <a href="#">Dưới 1 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 2 - 3 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 5 - 7 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 10 - 15 triệu</a></p>
          </div>
          <div>
            <p><span>›</span> <a href="#">Từ 1 - 2 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 3 - 5 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 7 - 10 triệu</a></p>
            <p><span>›</span> <a href="#">Trên 15 triệu</a></p>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Xem diện tích</h4>
        <div className="area-area">
          <div>
            <p><span>›</span> <a href="#">Dưới 20 m²</a></p>
            <p><span>›</span> <a href="#">Từ 30 - 50m²</a></p>
            <p><span>›</span> <a href="#">Từ 70 - 90m²</a></p>
          </div>
          <div>
            <p><span>›</span> <a href="#">Từ 20 - 30m²</a></p>
            <p><span>›</span> <a href="#">Từ 50 - 70m²</a></p>
            <p><span>›</span> <a href="#">Trên 90m²</a></p>
          </div>
        </div>
      </div>

      <p className="latest-posts-title">Tin mới đăng</p>
      {posts.map(post => (
        <Link
          key={post.id}
          to={`/posts/${post.id}`}
          className="post-item"
        >
          <img
            src={post.images[0]}
            alt={post.title}
          />
          <div className="post-info">
            <div>{post.title}</div>
            <div>{post.price}</div>
            <div>{post.postedDate}</div>
          </div>
        </Link>
      ))}

    </div>
  );
};

export default SidebarRight;
