import { Link } from 'react-router-dom';
import PostCard from './PostCard';
import posts from '../../data/postsData';


const PostList = () => {
  return (
    <div className="grid">
      {posts.map((post) => (
        <Link
          to={`/posts/${post.id}`}
          key={post.id}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <PostCard {...post} />
        </Link>
      ))}
    </div>
  );
};

export default PostList;
