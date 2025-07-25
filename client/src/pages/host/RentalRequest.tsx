// 📁 src/pages/host/RentalRequests.tsx
// TRANG DUYỆT YÊU CẦU THUÊ PHÒNG
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../../services/hostService";

const RentalRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRequests = () => {
    setLoading(true);
    hostService
      .getRentalRequests()
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (req: any) => {
    const confirm = window.confirm("Bạn có chắc muốn duyệt và tạo hợp đồng?");
    if (!confirm) return;

    hostService.approveRentalRequest(req.id).then(() => {
      alert("Đã duyệt yêu cầu. Chuyển sang trang tạo hợp đồng.");
      navigate("/host/create-contract", {
        state: {
          tenantName: req.tenantName,
          phone: req.phone,
          roomId: req.desiredRoomId,
        },
      });
    });
  };

  const handleReject = (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn từ chối?");
    if (!confirm) return;

    hostService.rejectRentalRequest(id).then(() => {
      alert("Đã từ chối yêu cầu.");
      fetchRequests();
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">📄 Yêu cầu thuê phòng</h2>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-400">Không có yêu cầu nào.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-indigo-100 text-indigo-700 text-sm">
              <tr>
                <th className="p-3 text-left">👤 Họ tên</th>
                <th className="p-3 text-left">📞 SĐT</th>
                <th className="p-3 text-left">✉️ Email</th>
                <th className="p-3 text-left">🏠 Phòng muốn thuê</th>
                <th className="p-3 text-left">📌 Trạng thái</th>
                <th className="p-3 text-center">⚙️ Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{req.tenantName}</td>
                  <td className="p-3">{req.phone}</td>
                  <td className="p-3">{req.email}</td>
                  <td className="p-3">{req.desiredRoomId}</td>
                  <td className="p-3 capitalize">{req.status}</td>
                  <td className="p-3 text-center">
                    {req.status === "chờ duyệt" ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleApprove(req)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          ✅ Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          ❌ Từ chối
                        </button>
                      </div>
                    ) : (
                      <span className="italic text-gray-500">{req.status}</span>
                    )}
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

export default RentalRequests;
