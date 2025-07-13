import '../css/PostCard.css';
type PostCardProps = {
  title: string;
  price: string;
  area: string;
  address: string;
  images: string[];
  description: string;
};

const PostCard = ({
  title = '',
  price = '',
  area = '',
  address = '',
  images = [],
  description = '',
}: PostCardProps) => {
  return (
    <div className="post-card">
      <div className="post-card-images">
        <div className="left-main-image">
          {images[0] && (
            <img src={images[0]} alt="Ảnh chính" className="main-image" />
          )}
        </div>
        <div className="right-sub-images">
          {images[1] && (
            <img src={images[1]} alt="Ảnh phụ 1" className="sub-image" />
          )}
          {images[2] && (
            <img src={images[2]} alt="Ảnh phụ 2" className="sub-image" />
          )}
        </div>
      </div>

      <div className="post-card-content">
        <div className="post-card-tag">CHO THUÊ NHANH</div>

        <h2 className="post-card-title">
          <span className="post-card-stars">★★★★★</span> {title}
        </h2>

        <div className="post-card-info">
          {price}
          <span> • {area} • {address}</span>
        </div>

        <p className="post-card-description">{description}</p>
      </div>
    </div>
  );
};

export default PostCard;
