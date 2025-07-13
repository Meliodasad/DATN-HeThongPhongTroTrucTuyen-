import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import posts from '../../data/postsData';
import '../../css/PostDetail.css'

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
        <div className="contact-header">
          <img
            src="https://tse2.mm.bing.net/th/id/OIP.vg41yG82qw84ziz5nS-CWQHaHa?pid=Api&P=0&h=220"  
            alt="avatar"
            className="avatar"
          />
          <div>
            <h3>Lê Như Ngọc</h3>
            <p className="sub-info">Đang hoạt động • Tham gia từ: 28/06/2025</p>
          </div>
        </div>

        <div className="contact-info">
          <p><strong>📞 Số điện thoại:</strong> <a href="">0901879823</a></p>
          <p><strong>💬 Zalo:</strong> <a href="#">Nhắn Zalo</a></p>
        </div>

        <div className="contact-actions">
          <button>Lưu tin</button>
          <button>Chia sẻ</button>
          <button>Báo cáo</button>
        </div>
      </div>

    </div>


  );
};

export default PostDetail;
