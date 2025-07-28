import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  Eye,
  User,
  XCircle,
} from "lucide-react";
import { useToastContext } from "../contexts/ToastContext";

interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  bookingDate: string;
  note: string;
  bookingStatus: "pending" | "confirmed" | "cancelled";
  approvalStatus: "approved" | "rejected" | "waiting";
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
  const { success, error } = useToastContext();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/bookings?_expand=room&_expand=tenant");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      error("Lỗi", "Không thể tải dữ liệu đặt phòng");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (
    bookingId: string,
    status: "confirmed" | "cancelled"
  ) => {
    try {
      const response = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingStatus: status }),
      });

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

  const handleUpdateApproval = async (
    bookingId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const response = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approvalStatus: status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }

      success(
        "Thành công",
        `${status === "approved" ? "Duyệt" : "Từ chối"} đơn thành công`
      );
      await loadBookings();
    } catch (err) {
      console.error(err);
      error("Lỗi", "Không thể cập nhật trạng thái duyệt");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý đặt phòng</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người thuê</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duyệt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap">{booking.tenant.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.room.roomTitle}</td>
<td className="px-6 py-4 whitespace-nowrap">
  {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.note}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.bookingStatus === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.bookingStatus === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {booking.bookingStatus === "confirmed"
                      ? "Đã xác nhận"
                      : booking.bookingStatus === "cancelled"
                      ? "Đã hủy"
                      : "Chờ xác nhận"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.approvalStatus === "approved"
                      ? "bg-green-100 text-green-800"
                      : booking.approvalStatus === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {booking.approvalStatus === "approved"
                      ? "Đã duyệt"
                      : booking.approvalStatus === "rejected"
                      ? "Từ chối"
                      : "Chờ duyệt"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {booking.bookingStatus === "pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                        className="text-green-600 hover:text-green-900"
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hủy
                      </button>
                    </>
                  )}
                  {booking.approvalStatus === "waiting" && (
                    <>
                      <button
                        onClick={() => handleUpdateApproval(booking.id, "approved")}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Duyệt đơn"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateApproval(booking.id, "rejected")}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Từ chối đơn"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;
