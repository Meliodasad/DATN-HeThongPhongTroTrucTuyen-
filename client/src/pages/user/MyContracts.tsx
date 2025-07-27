import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/MyContracts.css';

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
}

interface MyContractsProps {
  tenantId: string;
}

const MyContracts: React.FC<MyContractsProps> = ({ tenantId }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch(`http://localhost:3000/contracts?tenantId=${tenantId}`);
        const data = await res.json();
        setContracts(data);
      } catch (err) {
        console.error('Lỗi khi lấy contracts:', err);
      }
    };

    const fetchRooms = async () => {
      try {
        const res = await fetch(`http://localhost:3000/rooms`);
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error('Lỗi khi lấy rooms:', err);
      }
    };

    Promise.all([fetchContracts(), fetchRooms()]).finally(() => setLoading(false));
  }, [tenantId]);

  const getRoomTitle = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.roomTitle : 'Không tìm thấy phòng';
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Chưa có';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // fallback nếu chuỗi ngày không hợp lệ
    return date.toLocaleDateString();
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="contracts-container">
      <h2>📄 Hợp đồng thuê của bạn</h2>
      {contracts.length === 0 ? (
        <p>Không có hợp đồng nào.</p>
      ) : (
        contracts.map((contract) => (
          <div key={contract.id} className="contract-card">
            <p><strong>Phòng:</strong> {getRoomTitle(contract.roomId)}</p>
            <p><strong>Ngày bắt đầu:</strong> {formatDate(contract.startDate)}</p>
            <p><strong>Ngày kết thúc:</strong> {formatDate(contract.endDate)}</p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              <span className={`status ${contract.status}`}>
                {contract.status === 'pending' && 'Pending'}
                {contract.status === 'accepted' && 'Accepted'}
                {contract.status === 'rejected' && 'Rejected'}
                {contract.status === 'ended' && 'Ended'}
              </span>
            </p>

            {contract.status === 'accepted' && (
              <Link
                to={`/contracts/${contract.id}`}
                className="view-contract-button"
              >
                Xem hợp đồng
              </Link>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyContracts;
