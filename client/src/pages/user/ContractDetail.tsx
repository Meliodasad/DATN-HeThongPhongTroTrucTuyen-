import React from 'react';
import { useParams, Link } from 'react-router-dom';
import db from '../../data/db';
import '../../css/ContractDetail.css';

const ContractDetail = () => {
  const { id } = useParams();

  const storedContracts = JSON.parse(localStorage.getItem('contracts') || '[]');
  const contract = storedContracts.find((c: any) => c.id === id);

  if (!contract) return <div className="contract-detail">Không tìm thấy hợp đồng.</div>;

  const post = db.posts.find(p => p.id === contract.postId);
  const tenant = db.users.find(u => u.id === contract.tenantId);
  const host = post?.author;


  const getMonthsBetween = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
    );
  };

  const durationMonths = getMonthsBetween(contract.startDate, contract.endDate);

  return (
    <div className="contract-detail">
      <h2>Chi tiết hợp đồng</h2>

      <p><strong>Mã hợp đồng:</strong> {contract.id}</p>
      <p><strong>Trạng thái:</strong> {contract.status}</p>
      <p><strong>Ngày ký hợp đồng:</strong> {contract.startDate}</p>
      <p><strong>Ngày kết thúc:</strong> {contract.endDate}</p>
      <p><strong>Thời hạn hợp đồng:</strong> {durationMonths} tháng</p>

      {post && (
        <>
          <h3>Thông tin phòng</h3>
          <p><strong>Tên phòng:</strong> {post.title}</p>
          <p><strong>Địa chỉ:</strong> {post.address}</p>
          <p><strong>Giá thuê phòng:</strong> {post.price.toLocaleString()} VNĐ/tháng</p>
        </>
      )}

      {tenant && (
        <>
          <h3>Người thuê</h3>
          <p><strong>Họ tên:</strong> {tenant.name}</p>
          <p><strong>SĐT:</strong> {tenant.phone}</p>
        </>
      )}

      {host && (
        <>
          <h3>Bên cho thuê</h3>
          <p><strong>Họ tên:</strong> {host.name}</p>
          <p><strong>SĐT:</strong> {host.phone}</p>
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
