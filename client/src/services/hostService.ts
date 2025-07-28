// 📁 client/src/services/hostService.ts
import axios from "axios";

const API = "http://localhost:3000"; // Thay bằng endpoint thật

export const hostService = {
  
  // 1. Cập nhật thông tin cá nhân
  getProfile: () => axios.get(`${API}/hosts/1`), //Lấy thông tin cá nhân (lấy phần tử đầu tiên trong hosts)
  updateProfile: (data: any) => axios.put(`${API}/hosts/1`, data),
  
  // 2. Quản lý trạng thái phòng
  getRoomStatus: () => axios.get(`${API}/roomStatus`), //Lấy danh sách phòng
  updateRoomStatus: (roomId: number, status: string) =>
    axios.patch(`${API}/roomStatus/${roomId}`, { status }),        

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

  // Tạo phòng mới
  createRoom: (data: any) => axios.post(`${API}/rooms`, data),
  getRooms: () => axios.get(`${API}/rooms`), // Lấy danh sách phòng
  deleteRoom: (id: number) => axios.delete(`${API}/rooms/${id}`), // Xóa phòng

  // Sửa thông tin phòng
  getRoomById: (id: number) => axios.get(`${API}/rooms/${id}`),
  updateRoom: (id: number, data: any) => axios.put(`${API}/rooms/${id}`, data),

  // Statistics for dashboard
  getStatistics: () => {
    return Promise.all([
      axios.get(`${API}/rooms`),
      axios.get(`${API}/roomStatus`),
      axios.get(`${API}/contracts`)
    ]).then(([roomsRes, statusRes, contractsRes]) => {
      const rooms = roomsRes.data;
      const roomStatus = statusRes.data;
      const contracts = contractsRes.data;
      
      const totalRooms = rooms.length;
      const rentedRooms = roomStatus.filter((r: any) => r.status === "Đã cho thuê").length;
      const availableRooms = roomStatus.filter((r: any) => r.status === "Trống").length;
      const totalRevenue = rooms.reduce((sum: number, room: any) => sum + (room.price || 0), 0);

      return {
        data: {
          totalRooms,
          rentedRooms,
          availableRooms,
          totalRevenue
        }
      };
    });
  }
};