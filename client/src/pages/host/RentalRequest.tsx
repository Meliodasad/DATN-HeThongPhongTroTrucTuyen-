// TRANG DUYỆT VÀ TỪ CHỐI YÊU CẦU THUÊ PHÒNG
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

    // Cập nhật trạng thái yêu cầu
    hostService.approveRentalRequest(req.id).then(() => {
      alert("Đã duyệt yêu cầu. Chuyển sang trang tạo hợp đồng.");
      // Điều hướng tới trang tạo hợp đồng và truyền dữ liệu qua state
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
    <div style={{ padding: 20 }}>
      <h2>📄 Yêu cầu thuê phòng</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : requests.length === 0 ? (
        <p>Không có yêu cầu nào.</p>
      ) : (
        <table border={1} cellPadding={10} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>👤 Họ tên</th>
              <th>📞 SĐT</th>
              <th>✉️ Email</th>
              <th>🏠 Phòng muốn thuê</th>
              <th>📌 Trạng thái</th>
              <th>⚙️ Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.tenantName}</td>
                <td>{req.phone}</td>
                <td>{req.email}</td>
                <td>{req.desiredRoomId}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === "chờ duyệt" ? (
                    <>
                      <button onClick={() => handleApprove(req)}>✅ Duyệt</button>{" "}
                      <button onClick={() => handleReject(req.id)}>❌ Từ chối</button>
                    </>
                  ) : (
                    <em>{req.status}</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RentalRequests;
