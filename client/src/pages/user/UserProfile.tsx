import { Link, useParams } from 'react-router-dom';
import posts from '../../data/db';
import '../../css/UserProfile.css'

const UserProfile = () => {
  const { userId } = useParams();

  const userPosts = posts.filter(p => p.author.id === userId);
  const user = userPosts[0]?.author;

  if (!user) return <div className="user-profile-container">Người dùng không tồn tại.</div>;

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <img src={user.avatar} alt="avatar" className="avatar-large" />

        <div className="info">
          <h2>{user.name}</h2>
          <p className="sub-info">{user.status} • Tham gia từ: {user.joinedDate}</p>

          <div className="contact">
            <p><strong>📞 Điện thoại:</strong> <a href={`tel:${user.phone}`}>{user.phone}</a></p>
            <p><strong>💬 Zalo:</strong> <a href={user.zalo} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a></p>
          </div>
        </div>
      </div>

      <Link to={`/edit-profile/${user.id}`} className="edit-profile-button">
        Chỉnh sửa thông tin
      </Link>

      {userPosts.length > 0 && (
        <div className="user-posts">
          <h3>Bài đăng của {user.name}</h3>
          <div className="post-list">
            {userPosts.map(post => (
              <div key={post.id} className="post-card1">
                <img src={post.images[0]} alt="thumbnail" />
                <div className="post-info1">
                  <h4>{post.title}</h4>
                  <p>{post.price} • {post.area}</p>
                  <p>{post.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
