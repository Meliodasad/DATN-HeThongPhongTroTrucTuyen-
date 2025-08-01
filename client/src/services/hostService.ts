// 📁 client/src/services/hostService.ts
import axios from "axios";

const API = "http://localhost:3000";

// Thêm interceptor để xử lý lỗi
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const hostService = {
  
  // 1. Cập nhật thông tin cá nhân
  getProfile: () => axios.get(`${API}/hosts/1`),
  updateProfile: (data: any) => axios.put(`${API}/hosts/1`, data),
  
  // 2. Quản lý trạng thái phòng
  getRoomStatus: () => axios.get(`${API}/roomStatus`),
  updateRoomStatus: (roomId: number, status: string) =>
    axios.patch(`${API}/roomStatus/${roomId}`, { status }),        

  // 3. Duyệt yêu cầu thuê phòng
  getRentalRequests: () => axios.get(`${API}/rentalRequests`),
  approveRentalRequest: (id: string) =>
    axios.patch(`${API}/rentalRequests/${id}`, { status: "đã duyệt" }),
  rejectRentalRequest: (id: string) =>
    axios.patch(`${API}/rentalRequests/${id}`, { status: "đã từ chối" }),

  // 4. Tạo hợp đồng 
  createContract: (data: any) => axios.post(`${API}/contracts`, data),

  // 5. Quản lý hợp đồng
  getContracts: () => axios.get(`${API}/contracts`),
  getContractsByRoom: (roomId: number) => axios.get(`${API}/contracts?roomId=${roomId}`),
  getContractById: (id: string) => axios.get(`${API}/contracts/${id}`),
  deleteContract: (id: string | number) => axios.delete(`${API}/contracts/${id}`),



  // 6. Quản lý phòng
  createRoom: (data: any) => axios.post(`${API}/rooms`, data),
  getRooms: () => axios.get(`${API}/rooms`),
  getRoomById: (id: number) => axios.get(`${API}/rooms/${id}`),
  updateRoom: (id: number, data: any) => axios.put(`${API}/rooms/${id}`, data),
  deleteRoom: (id: number) => axios.delete(`${API}/rooms/${id}`),

  // 7. Thống kê
  getStatistics: () => {
    return Promise.all([
      axios.get(`${API}/rooms`),
      axios.get(`${API}/roomStatus`),
      axios.get(`${API}/contracts`),
      axios.get(`${API}/tenants?status_ne=inactive`)
    ]).then(([roomsRes, statusRes, contractsRes, tenantsRes]) => {
      const rooms = roomsRes.data;
      const roomStatus = statusRes.data;
      const contracts = contractsRes.data;
      const tenants = tenantsRes.data;
      
      const totalRooms = rooms.length;
      const rentedRooms = roomStatus.filter((r: any) => r.status === "Đã cho thuê").length;
      const availableRooms = roomStatus.filter((r: any) => r.status === "Trống").length;
      const totalRevenue = tenants.reduce((sum: number, tenant: any) => sum + (tenant.monthlyRent || 0), 0);
      const totalTenants = tenants.length;

      return {
        data: {
          totalRooms,
          rentedRooms,
          availableRooms,
          totalRevenue,
          totalTenants
        }
      };
    });
  },

  // 8. Quản lý người thuê
  getTenants: () => axios.get(`${API}/tenants?status_ne=inactive`),
  getTenantById: (id: number) => axios.get(`${API}/tenants/${id}`),
  updateTenant: (id: string | number, data: any) => axios.put(`${API}/tenants/${id}`, data),
  deleteTenant: (id: number) => axios.delete(`${API}/tenants/${id}`),

  // 9. Gắn người thuê vào phòng
  assignTenantToRoom: async (tenantData: {
    name: string;
    phone: string;
    email: string;
    roomId: number;
    roomCode: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    contractId?: number;
  }) => {
    try {
      const avatarUrl = `https://i.pravatar.cc/100?img=${Date.now() % 70 + 1}`;
      
      // 1. Tạo người thuê mới
      const tenantRes = await axios.post(`${API}/tenants`, {
        ...tenantData,
        avatar: avatarUrl,
        status: 'active'
      });

      // 2. Cập nhật trạng thái phòng thành "Đã cho thuê"
      await axios.patch(`${API}/roomStatus/${tenantData.roomId}`, { 
        status: "Đã cho thuê" 
      });

      // 3. Cập nhật thông tin tenant trong phòng
      await axios.patch(`${API}/rooms/${tenantData.roomId}`, {
        tenant: {
          name: tenantData.name,
          phone: tenantData.phone,
          avatar: avatarUrl
        }
      });

      return tenantRes;
    } catch (error) {
      console.error("❌ Lỗi gắn người thuê vào phòng:", error);
      throw error;
    }
  },

  // 10. Chấm dứt hợp đồng/Trả phòng
  terminateContract: async (contractId: number) => {
    try {
      // 1. Tìm hợp đồng để lấy thông tin
      const contractRes = await axios.get(`${API}/contracts/${contractId}`);
      const contract = contractRes.data;
      
      if (!contract) {
        throw new Error("Không tìm thấy hợp đồng");
      }

      // 2. Tìm người thuê dựa trên thông tin hợp đồng
      const tenantsRes = await axios.get(`${API}/tenants?contractId=${contractId}&status_ne=inactive`);
      const tenant = tenantsRes.data[0];
      
      if (!tenant) {
        throw new Error("Không tìm thấy người thuê tương ứng với hợp đồng");
      }

      // 3. Cập nhật trạng thái phòng về "Trống"
      await axios.patch(`${API}/roomStatus/${tenant.roomId}`, { 
        status: "Trống" 
      });

      // 4. Xóa thông tin tenant khỏi phòng
      await axios.patch(`${API}/rooms/${tenant.roomId}`, {
        tenant: null
      });

      // 5. Đánh dấu hợp đồng là đã chấm dứt
      await axios.patch(`${API}/contracts/${contractId}`, {
        status: "Đã chấm dứt",
        terminatedDate: new Date().toISOString().split('T')[0]
      });

      // 6. Đánh dấu người thuê là inactive
      await axios.patch(`${API}/tenants/${tenant.id}`, {
        status: "inactive",
        terminatedDate: new Date().toISOString().split("T")[0],
      });

      return { success: true, message: "Trả phòng thành công" };
    } catch (error) {
      console.error("❌ Lỗi chấm dứt hợp đồng:", error);
      throw error;
    }
  },

  // 11. Duyệt yêu cầu với gắn người thuê
  approveRentalRequestWithAssignment: async (requestId: string, contractData: any) => {
    try {
      // 1. Duyệt yêu cầu
      await axios.patch(`${API}/rentalRequests/${requestId}`, { status: "đã duyệt" });
      
      // 2. Tạo hợp đồng
      const contractRes = await axios.post(`${API}/contracts`, contractData);
      const contractId = contractRes.data.id;
      
      // 3. Lấy thông tin phòng để có giá thuê
      const roomRes = await axios.get(`${API}/rooms/${contractData.roomId}`);
      const room = roomRes.data;
      
      // 4. Gắn người thuê vào phòng
      await hostService.assignTenantToRoom({
        name: contractData.tenantName,
        phone: contractData.phone,
        email: contractData.email || `${contractData.tenantName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        roomId: contractData.roomId,
        roomCode: room.roomId || `P${contractData.roomId.toString().padStart(3, '0')}`,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        monthlyRent: room.price || 3000000,
        contractId: contractId
      });

      return contractRes;
    } catch (error) {
      console.error("❌ Lỗi duyệt yêu cầu và gắn người thuê:", error);
      throw error;
    }
  }
};