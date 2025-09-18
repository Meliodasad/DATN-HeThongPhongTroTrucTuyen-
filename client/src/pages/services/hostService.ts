// 📁 client/src/services/hostService.ts
import axios from "axios";

const API = "http://localhost:3000";

const api = axios.create({
  baseURL: API,
});

// interceptor: tự thêm Authorization vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const hostService = {
  // 1. Cập nhật thông tin cá nhân
  getProfile: () => api.get(`/auth/me`),
  updateProfile: (data: any) => api.put(`/auth/profile`, data),

  // 2. Quản lý trạng thái phòng
  getRoomStatus: () => api.get(`/approvals`),
  updateRoomStatus: (roomId: number, status: string) =>
    api.put(`/approvals/${roomId}`, { status }),

  // 3. Duyệt yêu cầu thuê phòng
  getRentalRequests: () => api.get(`/requests`),
  approveRentalRequest: (id: string) =>
    api.patch(`/rentalRequests/${id}`, { status: "đã duyệt" }),
  rejectRentalRequest: (id: string) =>
    api.patch(`/rentalRequests/${id}`, { status: "đã từ chối" }),

  // ✅ Tạo hợp đồng 
  createContract: (data: any) => api.post(`/contracts`, data),

  // QUẢN LÝ HỢP ĐỒNG
  getContracts: () => api.get(`/contracts`),
  getContractsByRoom: (roomId: string) => api.get(`/contracts?roomId=${roomId}`),
  getContractById: (id: string) => api.get(`/contracts/${id}`),
  deleteContract: (id: string) => api.delete(`/contracts/${id}`),

  // Tạo phòng mới
  createRoom: (data: any) => api.post(`/rooms`, data),
  getRooms: () => api.get(`rooms/my/rooms`),
  deleteRoom: (id: number) => api.delete(`/rooms/${id}`),

  // Sửa thông tin phòng
  getRoomById: (id: number) => api.get(`/rooms/${id}`),
  updateRoom: (id: number, data: any) => api.put(`/rooms/${id}`, data),

  // Statistics
  getStatistics: () => {
    return Promise.all([
      api.get(`/rooms`),
      api.get(`/roomStatus`),
      api.get(`/contracts`),
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
          totalRevenue,
        },
      };
    });
  },
};
