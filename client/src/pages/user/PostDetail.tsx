import { Link, useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import posts from '../../data/postsData';
import '../../css/PostDetail.css'
import ReportForm from '../../components/ReportForm';

const PostDetail = () => {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);

  if (!post) return <div className="post-detail-container">Bài đăng không tồn tại.</div>;

  const images = post.images.map(img => ({
    original: img,
    thumbnail: img,
  }));

  return (
    <div className="post-detail-container">
      <ImageGallery items={images} showPlayButton={false} showFullscreenButton={false} />

      <div className="post-info">
        <h1 className="title">{post.title}</h1>

        <div className="meta">
          <span className="price">{post.price}</span>
          <span className="dot">•</span>
          <span>{post.area}</span>
          <span className="dot">•</span>
          <span>{post.address}</span>
        </div>

        <div className="info-table">
          <div className="info-row"><span><strong>Quận huyện:</strong></span><span>{post.district}</span></div>
          <div className="info-row"><span><strong>Tỉnh thành:</strong></span><span>{post.province}</span></div>
          <div className="info-row"><span><strong>Địa chỉ:</strong></span><span>{post.fullAddress}</span></div>
          <div className="info-row"><span><strong>Mã tin:</strong></span><span>#{post.id.padStart(6, '0')}</span></div>
          <div className="info-row"><span><strong>Ngày đăng:</strong></span><span>{post.postedDate}</span></div>
          <div className="info-row"><span><strong>Ngày hết hạn:</strong></span><span>{post.expiredDate}</span></div>
        </div>

        <div className="description">
          <h3>Thông tin mô tả</h3>
          <p>{post.description}</p>
        </div>
      </div>

      <div className="contact-box">
        <Link to={`/user/${post.author.id}`} className="contact-header">
          <img src={post.author.avatar} alt="avatar" className="avatar" />
          <div>
            <h3>{post.author.name}</h3>
            <p className="sub-info">{post.author.status} • Tham gia từ: {post.author.joinedDate}</p>
          </div>
        </Link>

        <div className="contact-info">
          <p><strong>📞 Số điện thoại:</strong> <a href={`tel:${post.author.phone}`}>{post.author.phone}</a></p>
          <p><strong>💬 Zalo:</strong> <a href={post.author.zalo} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a></p>
        </div>

        <div className="contact-actions">
          <button className="action-button"> Lưu tin</button>
          <button className="action-button"> Chia sẻ</button>
          <button className="action-button"> Báo cáo</button>
        </div>~

        <ReportForm postId={post.id} />
      </div>

    </div>

  );
};

export default PostDetail;
