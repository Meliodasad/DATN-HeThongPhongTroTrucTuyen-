// 📁 src/pages/host/RentalRequests.tsx
// TRANG DUYỆT YÊU CẦU THUÊ PHÒNG
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../../services/hostService";
import RentalRequestCard from "../../components/RentalRequestCard";
import { Users, Filter } from "lucide-react";

interface RentalRequest {
  id: number;
  tenantName: string;
  phone: string;
  email: string;
  desiredRoomId: string;
  status: string;
  message: string;
  submittedAt: string;
  avatar: string;
}

const RentalRequests = () => {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RentalRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await hostService.getRentalRequests();
      const requestsWithDetails = res.data.map((req: any) => ({
        ...req,
        submittedAt: new Date().toLocaleDateString('vi-VN') + " - " + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        avatar: "https://i.pravatar.cc/100?img=" + req.id,
        message: "Tôi muốn thuê phòng này, có thể xem phòng được không?"
      }));
      setRequests(requestsWithDetails);
      setFilteredRequests(requestsWithDetails);
    } catch (error) {
      console.error("Error fetching rental requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;
    if (statusFilter !== "all") {
      filtered = requests.filter(req => req.status === statusFilter);
    }
    setFilteredRequests(filtered);
  }, [statusFilter, requests]);

  const handleApprove = async (req: RentalRequest) => {
    const confirm = window.confirm("Bạn có chắc muốn duyệt và tạo hợp đồng?");
    if (!confirm) return;

    try {
      await hostService.approveRentalRequest(req.id.toString());
      alert("Đã duyệt yêu cầu. Chuyển sang trang tạo hợp đồng.");
      navigate("/host/create-contract", {
        state: {
          tenantName: req.tenantName,
          phone: req.phone,
          roomId: req.desiredRoomId,
        },
      });
    } catch (error) {
      alert("Lỗi khi duyệt yêu cầu!");
      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    const confirm = window.confirm("Bạn có chắc muốn từ chối?");
    if (!confirm) return;

    try {
      await hostService.rejectRentalRequest(id.toString());
      alert("Đã từ chối yêu cầu.");
      fetchRequests();
    } catch (error) {
      alert("Lỗi khi từ chối yêu cầu!");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Yêu cầu thuê phòng</h1>
        <p className="text-gray-600">
          Quản lý và phản hồi các yêu cầu thuê phòng từ khách hàng
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="chờ duyệt">Chờ duyệt</option>
            <option value="đã duyệt">Đã duyệt</option>
            <option value="từ chối">Từ chối</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredRequests.length} trong tổng số {requests.length} yêu cầu
        </p>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter !== "all" ? "Không có yêu cầu nào" : "Chưa có yêu cầu thuê phòng"}
          </h3>
          <p className="text-gray-500">
            {statusFilter !== "all" 
              ? "Thử thay đổi bộ lọc để xem các yêu cầu khác"
              : "Các yêu cầu thuê phòng sẽ hiển thị ở đây"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RentalRequestCard
              key={request.id}
              request={request}
              onApprove={() => handleApprove(request)}
              onReject={() => handleReject(request.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalRequests;