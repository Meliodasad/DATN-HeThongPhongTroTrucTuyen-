import { Link, useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import db from '../../data/db';
import '../../css/PostDetail.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import ReportForm from '../../components/user/ReportForm';
import ReviewSection from '../../components/user/ReviewSection';

const PostDetail = () => {
  const { id } = useParams();
  const post = db.posts.find(p => p.id === id);

  if (!post) return <div className="post-detail-container">Bài đăng không tồn tại.</div>;

  const localUsers = localStorage.getItem('users');
  const users = localUsers ? JSON.parse(localUsers) : db.users;

  const author = users.find((u: any) => u.id === post.authorId);

  if (!author) return <div className="post-detail-container">Người đăng không tồn tại.</div>;

  const images = post.images.map(img => ({
    original: img,
    thumbnail: img,
  }));

  return (
    <div className="post-detail-container">
      <ImageGallery items={images} showPlayButton={false} showFullscreenButton={false} />

      <Link to={`/booking/${post.id}`} className="booking">
        Đặt phòng
      </Link>

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

      <Link to={`/user/${author.id}`} className="contact-header">
        <img src={author.avatar} alt="avatar" className="avatar" />
        <div>
          <h3>{author.name}</h3>
          <p className="sub-info">{author.status} • Tham gia từ: {author.joinedDate}</p>
        </div>
      </Link>

      <div className="contact-info">
        <p><strong>📞 Số điện thoại:</strong> <a href={`tel:${author.phone}`}>{author.phone}</a></p>
        <p><strong>💬 Zalo:</strong> <a href={author.zalo} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a></p>
      </div>

      <ReviewSection postId={post.id} />

      <ReportForm postId={post.id} />
    </div>
  );
};

export default PostDetail;
