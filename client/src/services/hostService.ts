import axios from "axios";

const API = "http://localhost:3000"; // Thay bằng endpoint thật

export const hostService = {
  
  // 1. Cập nhật thông tin cá nhân
  getProfile: () => axios.get(`${API}/hosts/1`), //Lấy thông tin cá nhân (lấy phần tử đầu tiên trong hosts)
  updateProfile: (data: any) => axios.put(`${API}/hosts/1`, data),
  
  // 2. Quản lý trạng thái phòng
  getRooms: () => axios.get(`${API}/rooms`), //Lấy danh sách phòng
  updateRoomStatus: (roomId: number, status: string) =>
    axios.patch(`${API}/rooms/${roomId}`, { status }),        

  // 3. Duyệt yêu cầu thuê phòng
  getRentalRequests: () => axios.get(`${API}/rentalRequests`),
  approveRentalRequest: (id: string) =>
    axios.patch(`${API}/rentalRequests/${id}`, { status: "đã duyệt" }),
  rejectRentalRequest: (id: string) =>
    axios.patch(`${API}/rentalRequests/${id}`, { status: "đã từ chối" }),

  // ✅ Tạo hợp đồng 
  createContract: (data: any) => axios.post(`${API}/contracts`, data),

  // QUẢN LÝ HỢP ĐỒNG
  getContracts: () => axios.get(`${API}/contracts`),
  getContractsByRoom: (roomId: number) => axios.get(`${API}/contracts?roomId=${roomId}`),

  // Xem chi tiết hợp đồng
  getContractById: (id: string) => axios.get(`${API}/contracts/${id}`),
  deleteContract: (id: number) => axios.delete(`${API}/contracts/${id}`),
};
