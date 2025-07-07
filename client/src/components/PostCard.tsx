type PostProps = {
  title: string;
  price: string;
  area: string;
  address: string;
  image: string;
};

const PostCard = ({ title, price, area, address, image }: PostProps) => {
  return (
    <div style={{
      display: 'flex',
      border: '1px solid #ddd',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 16
    }}>
      <img
        src={image}
        alt={title}
        style={{ width: 100, height: 100, objectFit: 'cover' }}
      />
      <div style={{ padding: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 'bold', color: '#f97316', margin: 0 }}>{title}</h3>
        <p style={{ margin: '8px 0', fontSize: 14, color: '#555' }}>{address}</p>
        <p style={{ fontSize: 14, color: '#333' }}>{price} • {area}</p>
      </div>
    </div>
  );
};

export default PostCard;
