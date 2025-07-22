import axios from "axios";

const API = "http://localhost:3000"; // Thay bằng endpoint thật

export const hostService = {
  
  getProfile: () => axios.get(`${API}/hosts/1`), //Lấy thông tin cá nhân (lấy phần tử đầu tiên trong hosts)
  updateProfile: (data: any) => axios.put(`${API}/hosts/1`, data),// 1.Cập nhật thông tin cá nhân
  
  getRooms: () => axios.get(`${API}/rooms`), //Lấy danh sách phòng
  updateRoomStatus: (roomId: number, status: string) =>
    axios.patch(`${API}/rooms/${roomId}`, { status }),        // 2. Quản lý trạng thái phòng

  approveRentalRequest: (id: string) => axios.post(`${API}/rental-requests/${id}/approve`),// 3. Duyệt yêu cầu thuê phòng

  assignTenant: (roomId: string, tenantId: string) => axios.post(`${API}/assign-tenant`, { roomId, tenantId }),// 4. Gắn người thuê vào phòng

  getTenantList: () => axios.get(`${API}/tenants`),// 5. Danh sách người thuê hiện tại

  terminateContract: (contractId: string) => axios.post(`${API}/contracts/${contractId}/terminate`),// 6. Chấm dứt hợp đồng/Trả phòng

  createContract: (data: any) => axios.post(`${API}/contracts`, data),// 7. Tạo hợp đồng thuê

  extendContract: (contractId: string, data: any) => axios.put(`${API}/contracts/${contractId}/extend`, data),// 8. Gia hạn hợp đồng

  getContractHistory: () => axios.get(`${API}/contracts/history`),// 9. Xem lịch sử hợp đồng

  createInvoice: (data: any) => axios.post(`${API}/invoices`, data),// 10. Tạo hóa đơn tiền phòng

  getRevenueStats: (filter: { type: "month" | "quarter" | "year" }) =>
    axios.get(`${API}/revenue`, { params: filter }),// 11. Thống kê doanh thu

  getTotalRentedRooms: () => axios.get(`${API}/rooms/total-rented`),// 12. Tổng số phòng đã cho thuê

  exportReport: (type: "excel" | "pdf") => axios.get(`${API}/report/export?type=${type}`, { responseType: 'blob' }),// 13. Xuất Excel/PDF

  connectPayment: (data: any) => axios.post(`${API}/connect/payment`, data),// 14. Kết nối thanh toán

  connectNotification: (platform: "zalo" | "facebook", data: any) =>
    axios.post(`${API}/connect/${platform}`, data),// 15. Kết nối Zalo OA/Facebook

  logout: () => axios.post(`${API}/logout`),// 16. Đăng xuất
};
