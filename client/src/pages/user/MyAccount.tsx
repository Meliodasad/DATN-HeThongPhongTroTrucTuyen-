import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MyAccount: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) return;

        const res = await axios.get(`http://localhost:3000/users?id=${user.id}`);
        const data = res.data && res.data.length > 0 ? res.data[0] : null;
        setProfile(data);
      } catch (err) {
        console.error('Lỗi tải profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Không tìm thấy thông tin tài khoản</div>;

  return (
    <div className="flex p-6 bg-[#f7f7f7] min-h-screen">
      <div className="w-1/4 bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <img
            src={profile.avatar || '/default-avatar.png'}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <h2 className="mt-4 text-lg font-semibold">{profile.fullName}</h2>
          <p className="text-gray-600">Số điện thoại: {profile.phone || 'Chưa cập nhật'}</p>
          <p className="text-blue-600 font-bold">Số dư: {profile.balance?.toLocaleString() || 0} VND</p>
        </div>

        <ul className="mt-6 space-y-3">
          <li className="text-blue-600 font-semibold">Thông tin cá nhân</li>
          <li className="hover:underline cursor-pointer">Đổi mật khẩu</li>
          <li className="hover:underline cursor-pointer">Quản lý bài viết</li>
          <li className="hover:underline cursor-pointer">Nạp tiền</li>
        </ul>
      </div>

      <div className="w-3/4 ml-6 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Chỉnh sửa thông tin
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium">Họ và tên</p>
            <p>{profile.fullName}</p>
          </div>
          <div>
            <p className="font-medium">Số điện thoại</p>
            <p>{profile.phone || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p>{profile.email}</p>
          </div>
          <div>
            <p className="font-medium">Địa chỉ</p>
            <p>{profile.address || 'Chưa cập nhật'}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Tin yêu thích</h3>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Tiêu đề</th>
                <th className="p-2 border">Giá</th>
                <th className="p-2 border">Ngày đăng</th>
                <th className="p-2 border">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border text-center" colSpan={4}>
                  No data
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
