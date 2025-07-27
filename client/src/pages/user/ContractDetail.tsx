import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../css/ContractDetail.css';

interface Contract {
  id: string;
  tenantId: string;
  roomId: string;
  hostId?: string;
  startDate: string;
  endDate: string;
  status?: string;          // hoặc contractStatus
  contractStatus?: string;
  terms?: string;
}

interface Room {
  id: string;
  roomTitle: string;
  location: string;
  price?: number;
  hostId: string;
}

interface User {
  id: string;
  fullName: string;
  phone?: string;
}

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [tenant, setTenant] = useState<User | null>(null);
  const [host, setHost] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy hợp đồng
        const resContract = await fetch(`http://localhost:3000/contracts/${id}`);
        const contractData: Contract = await resContract.json();
        setContract(contractData);

        // Lấy phòng
        const resRoom = await fetch(`http://localhost:3000/rooms/${contractData.roomId}`);
        const roomData: Room = await resRoom.json();
        setRoom(roomData);

        // Lấy người thuê
        const resTenant = await fetch(`http://localhost:3000/users/${contractData.tenantId}`);
        const tenantData: User = await resTenant.json();
        setTenant(tenantData);

        // Lấy người cho thuê (host)
        // Nếu contract có hostId thì lấy, còn không lấy theo room.hostId
        const hostId = contractData.hostId || roomData.hostId;
        const resHost = await fetch(`http://localhost:3000/users/${hostId}`);
        const hostData: User = await resHost.json();
        setHost(hostData);

      } catch (error) {
        console.error('Lỗi khi tải dữ liệu hợp đồng:', error);
      }
    };

    fetchData();
  }, [id]);

  const getMonthsBetween = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
    );
  };

  if (!contract) return <div className="contract-detail">Đang tải hợp đồng...</div>;

  const durationMonths = getMonthsBetween(contract.startDate, contract.endDate);
  const status = contract.status || contract.contractStatus || 'unknown';

  return (
    <div className="contract-detail">
      <h2>Chi tiết hợp đồng</h2>

      <p><strong>Mã hợp đồng:</strong> {contract.id}</p>
      <p><strong>Trạng thái:</strong> {status}</p>
      <p><strong>Ngày ký hợp đồng:</strong> {new Date(contract.startDate).toLocaleDateString()}</p>
      <p><strong>Ngày kết thúc:</strong> {new Date(contract.endDate).toLocaleDateString()}</p>
      <p><strong>Thời hạn hợp đồng:</strong> {durationMonths} tháng</p>

      {room && (
        <>
          <h3>Thông tin phòng</h3>
          <p><strong>Tên phòng:</strong> {room.roomTitle}</p>
          <p><strong>Địa chỉ:</strong> {room.location}</p>
          <p><strong>Giá thuê phòng:</strong> {room.price ? room.price.toLocaleString() + ' VNĐ/tháng' : 'Chưa có'}</p>
        </>
      )}

      {tenant && (
        <>
          <h3>Người thuê</h3>
          <p><strong>Họ tên:</strong> {tenant.fullName}</p>
          <p><strong>SĐT:</strong> {tenant.phone || 'Chưa có'}</p>
        </>
      )}

      {host && (
        <>
          <h3>Bên cho thuê</h3>
          <p><strong>Họ tên:</strong> {host.fullName}</p>
          <p><strong>SĐT:</strong> {host.phone || 'Chưa có'}</p>
        </>
      )}

      {contract.terms && (
        <>
          <h3>Điều khoản hợp đồng</h3>
          <p>{contract.terms}</p>
        </>
      )}

      <Link to="/my-contracts" className="back-button">← Quay lại danh sách hợp đồng</Link>
    </div>
  );
};

export default ContractDetail;
