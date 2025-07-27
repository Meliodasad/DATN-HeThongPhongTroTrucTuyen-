import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import posts from '../../data/db';
import '../../css/EditProfile.css'

const EditProfile = () => {
  const { userId } = useParams();
  const postWithUser = posts.find(p => p.author.id === userId);
  const user = postWithUser?.author;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    zalo: user?.zalo || '',
    avatar: user?.avatar || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Thông tin cập nhật:", formData);
    alert('Cập nhật thành công');
    navigate(`/user/${userId}`);
  };

  if (!user) return <div>Không tìm thấy người dùng.</div>;

  return (
    <div className="edit-profile-container">
      <h2>Cập nhật thông tin cá nhân</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>
          Họ tên:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Số điện thoại:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </label>
        <label>
          Zalo:
          <input type="text" name="zalo" value={formData.zalo} onChange={handleChange} />
        </label>
        <label>
          Ảnh đại diện:
          <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} />
        </label>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default EditProfile;
