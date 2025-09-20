import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../css/MyAccount.css';
import { headers as baseHeaders } from '../../utils/config';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { userService } from '../services/userService';

type ContractStatus = 'pending' | 'active' | 'expired' | 'terminated';

type ApiContract = {
  _id: string;
  contractId: string;
  bookingId?: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate?: string;
  duration?: number;          // tháng
  rentPrice?: number;         // tổng kỳ thuê
  terms?: string;
  status: ContractStatus;
  createdAt?: string;
  updatedAt?: string;
  roomInfo?: {
    roomId: string;
    roomTitle: string;
    price?: { value: number; unit: string }; // có thể có / hoặc không
    location?: string;
    images?: string[];
    hostId?: string;
  };
};

type Row = {
  id: string;                // dùng contractId
  contractId: string;
  roomId: string;
  roomTitle: string;
  image: string;
  monthlyPrice: number;      // giá / tháng
  totalPrice: number;        // rentPrice tổng
  startDate: string;
  endDate?: string;
  status: ContractStatus;
};

const MyAccount: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); 
  const authHeaders = React.useMemo(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    return token ? { ...baseHeaders, Authorization: `Bearer ${token}` } : baseHeaders;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;

        // Hồ sơ
        const resUser: any = await userService.getUserById(user.id);
        setProfile(resUser.data);

        // Hợp đồng của tenant
        const res = await axios.get('http://localhost:3000/contracts/tenant', {
          headers: authHeaders,
        });

        const list: ApiContract[] =
          res.data?.data?.contracts ??
          res.data?.contracts ??
          res.data ??
          [];

        const adapted: Row[] = list.map((c) => {
          const img =
            (c.roomInfo?.images && c.roomInfo.images[0]) ||
            '/default-room.jpg';
          const monthly = typeof c.roomInfo?.price?.value === 'number'
            ? c.roomInfo!.price!.value
            : (typeof c.rentPrice === 'number' && c.duration ? Math.floor(c.rentPrice / Math.max(c.duration, 1)) : 0);
          const total = typeof c.rentPrice === 'number'
            ? c.rentPrice!
            : monthly * (c.duration || 1);

          return {
            id: c.contractId || c._id,
            contractId: c.contractId || c._id,
            roomId: c.roomId,
            roomTitle: c.roomInfo?.roomTitle || c.roomId,
            image: img,
            monthlyPrice: monthly || 0,
            totalPrice: total || 0,
            startDate: c.startDate,
            endDate: c.endDate,
            status: c.status,
          };
        });

        setRows(adapted);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authHeaders]);

  const handlePay = (contractId: string, amount: number) => {
    // tuỳ flow của bạn:
    // 1) Điều hướng tới trang thanh toán riêng:
    navigate(`/payments/contract/${contractId}`, { state: { amount } });

    // 2) Hoặc call API tạo payment rồi điều hướng (nếu đã có paymentService)
    // await paymentService.createPayment({ contractId, amount })
    // navigate('/payments/checkout/:paymentId')
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
        <p className="myaccount-balance">Số dư: {profile.balance?.toLocaleString('vi-VN') || 0} VND</p>

        <ul className="myaccount-menu">
          <li className="active">Thông tin cá nhân</li>
          <li onClick={() => {/* mở modal đổi mật khẩu */}}>Đổi mật khẩu</li>
          <li>Nạp tiền</li>
            <li
            onClick={() => navigate('/my-bookings')}
            className={location.pathname === '/my-bookings' ? 'active' : ''}
            title="Xem các booking của tôi"
          >
            My - Booking
          </li>
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
          <h3>Lịch sử hợp đồng</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Phòng</th>
                  <th>Giá / tháng</th>
                  <th>Tổng kỳ thuê</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <img
                          src={r.image}
                          alt={r.roomTitle}
                          className="room-img"
                        />
                      </td>
                      <td>{r.roomTitle}</td>
                      <td>{r.monthlyPrice.toLocaleString('vi-VN')} VND</td>
                      <td>{r.totalPrice.toLocaleString('vi-VN')} VND</td>
                      <td>{new Date(r.startDate).toLocaleDateString('vi-VN')}</td>
                      <td>{r.endDate ? new Date(r.endDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td className={`status ${r.status}`}>{r.status}</td>
                      <td>
                        {r.status === 'pending' ? (
                          <button
                            className="btn-pay"
                            onClick={() => handlePay(r.contractId, r.totalPrice)}
                          >
                            Thanh toán
                          </button>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="no-data">Chưa có hợp đồng</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu*/}
    </div>
  );
};

export default MyAccount;
