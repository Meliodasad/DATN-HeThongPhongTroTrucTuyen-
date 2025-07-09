import React from 'react';

const posts = [
  {
    id: 1,
    title: 'Phòng trọ giá rẻ Quận 1, đầy đủ nội thất',
    owner: 'Nguyễn Văn A',
    date: '2025-07-06',
    image: 'https://bandon.vn/uploads/posts/thiet-ke-nha-tro-dep-2020-bandon-0.jpg',
    status: 'Chờ duyệt',
  },
  {
    id: 2,
    title: 'Phòng mới xây, gần trường ĐH Bách Khoa',
    owner: 'Trần Thị B',
    date: '2025-07-05',
    image: 'https://kientructrangkim.com/wp-content/uploads/2022/11/thiet-ke-noi-that-phong-tro-19.jpg',
    status: 'Chờ duyệt',
  },
];

const Owners = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <span>📋</span> Duyệt bài đăng
      </h2>

      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col md:flex-row items-center md:items-start justify-between border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200"
          >
            {/* Image */}
            <div className="w-full md:w-1/4 mb-4 md:mb-0">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1 md:px-6 w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.title}</h3>
              <p className="text-sm text-gray-600">
                Người đăng: <span className="font-medium text-gray-800">{post.owner}</span>
              </p>
              <p className="text-sm text-gray-600">Ngày đăng: {post.date}</p>
              <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                {post.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm shadow">
                ✅ Duyệt
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm shadow">
                ❌ Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Owners;
