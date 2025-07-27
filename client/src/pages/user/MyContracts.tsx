import React from 'react';
import db from '../../data/db';
import { Link } from 'react-router-dom';
import '../../css/MyContracts.css';

interface Contract {
  id: string;
  tenantId: string;
  postId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'ended';
}

interface MyContractsProps {
  tenantId: string;
}

const MyContracts = ({ tenantId }: MyContractsProps) => {
  const storedContracts = localStorage.getItem('contracts');
  const allContracts: Contract[] = storedContracts ? JSON.parse(storedContracts) : [];
  const contracts = allContracts.filter((c) => c.tenantId === tenantId);

  const getPostTitle = (postId: string) => {
    const post = db.posts.find((p) => p.id === postId);
    return post ? post.title : 'Không tìm thấy phòng';
  };

  return (
    <div className="contracts-container">
      <h2>📄 Hợp đồng thuê của bạn</h2>
      {contracts.length === 0 ? (
        <p>Không có hợp đồng nào.</p>
      ) : (
        contracts.map((contract) => (
          <div key={contract.id} className="contract-card">
            <p><strong>Phòng:</strong> {getPostTitle(contract.postId)}</p>
            <p><strong>Ngày bắt đầu:</strong> {contract.startDate}</p>
            <p><strong>Ngày kết thúc:</strong> {contract.endDate || 'Chưa có'}</p>
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
