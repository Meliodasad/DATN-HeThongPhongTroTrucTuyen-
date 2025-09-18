import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import "../../css/MyAccount.css"
import { userService } from '../../services/userService';
import { headers } from '../../utils/config';

interface Contract {
  id: string;
  tenantId: string;
  roomId: string;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'ended';
}

interface Room {
  id: string;
  roomTitle: string;
  price: number;
  address: string;
  images?: string;
}

const MyAccount: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;

        const resUser: any = await userService.getUserById(user.id);
        setProfile(resUser.data);

        const resContracts = await axios.get(`http://localhost:3000/contracts?tenantId=${user.id}`, { headers });
        const userContracts = resContracts.data.filter(
          (c: Contract) => c.status === 'accepted' || c.status === 'ended'
        );
        setContracts(userContracts);

        const roomIds = userContracts.map((c: Contract) => c.roomId);
        if (roomIds.length > 0) {
          const resRooms = await axios.get(`http://localhost:3000/rooms?id=${roomIds.join('&id=')}`);
          setRooms(resRooms.data);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getRoomInfo = (roomId: string) => rooms.find(r => r.id === roomId);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới không khớp!");
      return;
    }

    if (currentPassword !== profile.password) {
      setMessage("Mật khẩu hiện tại không đúng!");
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        password: newPassword
      });
      setMessage("Đổi mật khẩu thành công!");
      setShowChangePassword(false);
    } catch (error) {
      setMessage("Lỗi đổi mật khẩu!");
    }
  };

  if (loading) return <div className="loading-text">Loading...</div>;
  if (!profile) return <div className="loading-text">Không tìm thấy thông tin tài khoản</div>;

  return (
    <div className="myaccount-container">
      <div className="myaccount-sidebar">
        <img
          src={user?.avatar || 'https://i.pravatar.cc/40'}
          alt="avatar"
          className="myaccount-avatar"
        />
        <h2 className="myaccount-name">{profile.fullName}</h2>
        <p className="myaccount-phone">📞 {profile.phone || 'Chưa cập nhật'}</p>
        <p className="myaccount-balance">Số dư: {profile.balance?.toLocaleString() || 0} VND</p>

        <ul className="myaccount-menu">
          <li className="active">Thông tin cá nhân</li>
          <li onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</li>
          <li>Nạp tiền</li>
        </ul>
      </div>

      <div className="myaccount-main">
        <div className="myaccount-header">
          <h2>Thông tin cá nhân</h2>
          <button className="btn-edit">Chỉnh sửa</button>
        </div>

        <div className="myaccount-info-grid">
          <div>
            <p className="label">Họ và tên</p>
            <p className="value">{profile.fullName}</p>
          </div>
          <div>
            <p className="label">Số điện thoại</p>
            <p className="value">{profile.phone || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <p className="label">Email</p>
            <p className="value">{profile.email}</p>
          </div>
          <div>
            <p className="label">Địa chỉ</p>
            <p className="value">{profile.address || 'Chưa cập nhật'}</p>
          </div>
        </div>

        <div className="myaccount-history">
          <h3>Lịch sử phòng đã thuê</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Phòng</th>
                  <th>Giá thuê</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {contracts.length > 0 ? (
                  contracts.map((c) => {
                    const room = getRoomInfo(c.roomId);
                    return (
                      <tr key={c.id}>
                        <td>
                          <img
                            src={room?.images || '/default-room.jpg'}
                            alt={room?.roomTitle || 'Phòng'}
                            className="room-img"
                          />
                        </td>
                        <td>{room?.roomTitle || 'N/A'}</td>
                        <td>{room?.price?.toLocaleString() || 0} VND</td>
                        <td>{new Date(c.startDate).toLocaleDateString()}</td>
                        <td>{c.endDate ? new Date(c.endDate).toLocaleDateString() : '-'}</td>
                        <td className={`status ${c.status}`}>{c.status}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="no-data">Chưa có lịch sử thuê phòng</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showChangePassword && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Đổi mật khẩu</h3>
            {message && <p className="message">{message}</p>}
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleChangePassword} className="btn-confirm">Xác nhận</button>
              <button onClick={() => setShowChangePassword(false)} className="btn-cancel">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
