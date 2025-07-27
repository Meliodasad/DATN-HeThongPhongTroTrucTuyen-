import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/EditProfile.css';

interface User {
  id: string;
  name: string;
  phone: string;
  zalo: string;
  avatar: string;
}

const EditProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zalo: '',
    avatar: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/users/${userId}`)
      .then(res => res.json())
      .then((data: User) => {
        setUser(data);
        setFormData({
          name: data.name,
          phone: data.phone,
          zalo: data.zalo,
          avatar: data.avatar,
        });
      })
      .catch(err => {
        console.error("Không thể load user:", err);
      });
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    fetch(`http://localhost:3000/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...user, ...formData }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        alert('Cập nhật thành công');
        navigate(`/user/${userId}`);
      })
      .catch(err => {
        console.error("Lỗi khi cập nhật:", err);
        alert("Có lỗi xảy ra khi cập nhật.");
      });
  };

  if (!user) return <div>Đang tải thông tin người dùng...</div>;

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
