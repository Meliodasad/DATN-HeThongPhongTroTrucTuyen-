import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useToastContext } from "../contexts/ToastContext";

interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  bookingDate: string;
  note: string;
  bookingStatus: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  room: {
    roomTitle: string;
    location: string;
    price: number;
    images: string[];
  };
  tenant: {
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "cancelled"
  >("all");

  const { success, error } = useToastContext();

  useEffect(() => {
    loadBookings();
  }, []);

const loadBookings = async () => {
  try {
    const bookingsRes = await fetch("http://localhost:5000/bookings");

    // Nếu không phải response thành công (status != 200–299)
    if (!bookingsRes.ok) {
      const errorText = await bookingsRes.text();
      console.error("❌ API trả về lỗi (không phải JSON):", errorText);
      throw new Error(`API lỗi: ${bookingsRes.status}`);
    }

    // Thử parse JSON
    let bookingsData;
    try {
      bookingsData = await bookingsRes.json();
    } catch (jsonError) {
      const text = await bookingsRes.text();
      console.error("❌ Không thể parse JSON. Dữ liệu trả về:", text);
      throw new Error("Phản hồi không phải JSON hợp lệ");
    }

    setBookings(bookingsData);
    setFilteredBookings(bookingsData);
  } catch (error) {
    console.error("❌ Lỗi khi tải bookings:", error);
    toast.error("Không thể tải danh sách đặt phòng. Vui lòng thử lại sau.");
  }
};



  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.room.roomTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tenant.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.room.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.bookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (
    bookingId: string,
    status: "confirmed" | "cancelled"
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingStatus: status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      success(
        "Thành công",
        `${status === "confirmed" ? "Xác nhận" : "Hủy"} đặt phòng thành công`
      );
      await loadBookings();
    } catch (err) {
      console.error(err);
      error("Lỗi", "Không thể cập nhật trạng thái đặt phòng");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.bookingStatus === "pending").length,
    confirmed: bookings.filter((b) => b.bookingStatus === "confirmed").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý đặt phòng
          </h1>
          <p className="text-gray-600">
            Quản lý các yêu cầu đặt phòng từ khách hàng
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng đặt phòng
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.confirmed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hủy</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên phòng, khách hàng, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách đặt phòng ({filteredBookings.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng trọ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {booking.room.images &&
                        booking.room.images.length > 0 && (
                          <img
                            src={booking.room.images[0]}
                            alt={booking.room.roomTitle}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {booking.room.roomTitle}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">
                            {booking.room.location}
                          </span>
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {formatPrice(booking.room.price)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {booking.tenant.avatar ? (
                          <img
                            src={booking.tenant.avatar}
                            alt={booking.tenant.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.tenant.fullName}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          {booking.tenant.email}
                        </div>
                        {booking.tenant.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {booking.tenant.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.bookingDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Tạo: {formatDate(booking.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      <p className="line-clamp-2">
                        {booking.note || "Không có ghi chú"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        booking.bookingStatus
                      )}`}
                    >
                      {getStatusText(booking.bookingStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {booking.bookingStatus === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "confirmed")
                            }
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Xác nhận đặt phòng"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "cancelled")
                            }
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Hủy đặt phòng"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              Không tìm thấy đặt phòng nào
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
