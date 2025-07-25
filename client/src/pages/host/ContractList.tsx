// 📁 src/pages/host/ContractList.tsx
// TRANG DANH SÁCH HỢP ĐỒNG
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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
        📋 Danh sách hợp đồng thuê phòng
      </h2>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="font-medium text-gray-700">
          🔍 Lọc theo ID phòng:
        </label>
        <input
          type="number"
          placeholder="Nhập mã phòng..."
          value={filterRoomId}
          onChange={(e) => setFilterRoomId(e.target.value)}
          className="px-3 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => setFilterRoomId("")}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 text-sm"
        >
          Xóa lọc
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : contracts.length === 0 ? (
        <p className="text-red-500 font-semibold text-center">
          Không có hợp đồng nào.
        </p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="w-full border border-gray-300 bg-white text-sm">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Người thuê</th>
                <th className="p-3 text-left">SĐT</th>
                <th className="p-3 text-left">Phòng</th>
                <th className="p-3 text-left">Bắt đầu</th>
                <th className="p-3 text-left">Kết thúc</th>
                <th className="p-3 text-left">Tiền cọc</th>
                <th className="p-3 text-left">Điều khoản</th>
                <th className="p-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{contract.id}</td>
                  <td className="p-3">{contract.tenantName}</td>
                  <td className="p-3">{contract.phone}</td>
                  <td className="p-3">{contract.roomId}</td>
                  <td className="p-3">{contract.startDate}</td>
                  <td className="p-3">{contract.endDate}</td>
                  <td className="p-3 text-green-600 font-medium">
                    {contract.deposit.toLocaleString()}₫
                  </td>
                  <td className="p-3 whitespace-pre-wrap max-w-xs">
                    {contract.terms}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/host/contracts/${contract.id}`)
                      }
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleDelete(contract.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContractList;
