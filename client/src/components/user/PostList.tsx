import { Link } from 'react-router-dom';
import PostCard from './PostCard';
import db from '../../data/db';
import type { Post } from '../../data/db';

const PostList = () => {
  const posts: Post[] = db.posts;

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
