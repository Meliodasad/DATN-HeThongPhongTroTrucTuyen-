import { useEffect, useState } from "react";
import { hostService } from "../../services/hostService";
import { useNavigate } from "react-router-dom";

const ContractList = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterRoomId, setFilterRoomId] = useState("");
  const navigate = useNavigate();

  const fetchContracts = () => {
    setLoading(true);
    if (filterRoomId) {
      hostService
        .getContractsByRoom(parseInt(filterRoomId))
        .then((res) => setContracts(res.data))
        .finally(() => setLoading(false));
    } else {
      hostService
        .getContracts()
        .then((res) => setContracts(res.data))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [filterRoomId]);

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa hợp đồng này?");
    if (!confirmDelete) return;

    hostService.deleteContract(id).then(() => {
      alert("Đã xóa hợp đồng.");
      fetchContracts(); // cập nhật lại danh sách sau khi xóa
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 10 }}>Danh sách hợp đồng thuê phòng</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Lọc theo ID phòng:</label>{" "}
        <input
          type="number"
          placeholder="Nhập mã phòng..."
          value={filterRoomId}
          onChange={(e) => setFilterRoomId(e.target.value)}
          style={{ padding: 5 }}
        />
        <button onClick={() => setFilterRoomId("")} style={{ marginLeft: 10 }}>
          Xóa lọc
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : contracts.length === 0 ? (
        <p>Không có hợp đồng nào.</p>
      ) : (
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Người thuê</th>
              <th>SDT</th>
              <th>Phòng</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Tiền cọc</th>
              <th>Điều khoản</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.id}</td>
                <td>{contract.tenantName}</td>
                <td>{contract.phone}</td>
                <td>{contract.roomId}</td>
                <td>{contract.startDate}</td>
                <td>{contract.endDate}</td>
                <td>{contract.deposit.toLocaleString()}₫</td>
                <td>{contract.terms}</td>
                <td>
                  <button
                    onClick={() => navigate(`/host/contracts/${contract.id}`)}
                    style={{ marginRight: 5 }}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => handleDelete(contract.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContractList;
