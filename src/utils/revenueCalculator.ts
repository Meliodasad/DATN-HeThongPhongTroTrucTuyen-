// Utility để tính tổng doanh thu từ các nguồn khác nhau
import axios from 'axios';

const API = "http://localhost:3000";

// Interfaces dựa trên database schema hiện tại
export interface Invoice {
  id?: string;
  roomId: string;
  tenantName: string;
  roomPrice: number;
  electricityAmount: number;
  electricityRate: number;
  electricityTotal: number;
  waterAmount: number;
  waterRate: number;
  waterTotal: number;
  otherFees: number;
  otherFeesDescription: string;
  totalAmount: number;
  month: number;
  year: number;
  dueDate: string;
  createdDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
}

export interface Room {
  id?: number;
  roomId: string;
  area: number;
  price: number;
  utilities: string[];
  maxPeople: number;
  images: string[];
  description?: string;
  location?: string;
  deposit?: string;
  electricity?: string;
  status?: string;
  tenant?: {
    userId: string;
    fullName: string;
    phone: string;
    avatar: string;
  };
}

export interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  averageRoomPrice: number;
  occupancyRate: number;
  revenueByMonth: { month: string; revenue: number }[];
  revenueByRoom: { roomId: string; revenue: number; roomTitle: string }[];
}

export interface PaymentStats {
  totalInvoices: number;
  paidAmount: number;
  unpaidAmount: number;
  overdueAmount: number;
  invoicesByMonth: { month: string; amount: number }[];
}

export interface RoomStats {
  totalRooms: number;
  available: number;
  rented: number;
  maintenance: number;
  occupancyRate: number;
  averagePrice: number;
  totalPotentialRevenue: number;
  actualRevenue: number;
  roomsByStatus: { status: string; count: number }[];
}

export class RevenueCalculator {
  
  /**
   * Tính tổng doanh thu từ invoices
   */
  static async calculateTotalRevenue(): Promise<RevenueData> {
    try {
      const [invoicesRes, roomsRes] = await Promise.all([
        axios.get(`${API}/invoices`),
        axios.get(`${API}/rooms`)
      ]);

      const invoices: Invoice[] = invoicesRes.data;
      const rooms: Room[] = roomsRes.data;

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      // Lọc invoices theo trạng thái
      const paidInvoices = invoices.filter((inv: Invoice) => inv.status === 'paid');
      const unpaidInvoices = invoices.filter((inv: Invoice) => inv.status === 'unpaid');
      const overdueInvoices = invoices.filter((inv: Invoice) => inv.status === 'overdue');

      // Tính tổng doanh thu từ invoices đã thanh toán
      const totalRevenue = paidInvoices.reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);

      // Doanh thu tháng hiện tại
      const monthlyRevenue = paidInvoices
        .filter((invoice: Invoice) => {
          return invoice.month === currentMonth && invoice.year === currentYear;
        })
        .reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);

      // Doanh thu năm hiện tại
      const yearlyRevenue = paidInvoices
        .filter((invoice: Invoice) => invoice.year === currentYear)
        .reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);

      // Giá phòng trung bình
      const averageRoomPrice = rooms.length > 0 
        ? rooms.reduce((sum: number, room: Room) => sum + room.price, 0) / rooms.length 
        : 0;

      // Tỷ lệ lấp đầy (dựa trên rooms có tenant)
      const rentedRooms = rooms.filter((room: Room) => room.tenant).length;
      const occupancyRate = rooms.length > 0 ? (rentedRooms / rooms.length) * 100 : 0;

      // Doanh thu theo tháng (12 tháng gần nhất)
      const revenueByMonth = this.calculateRevenueByMonth(paidInvoices, currentYear);

      // Doanh thu theo phòng
      const revenueByRoom = this.calculateRevenueByRoom(paidInvoices);

      return {
        totalRevenue,
        monthlyRevenue,
        yearlyRevenue,
        paidInvoices: paidInvoices.length,
        unpaidInvoices: unpaidInvoices.length,
        overdueInvoices: overdueInvoices.length,
        averageRoomPrice,
        occupancyRate,
        revenueByMonth,
        revenueByRoom
      };
    } catch (error) {
      console.error('Error calculating revenue:', error);
      throw error;
    }
  }

  /**
   * Tính doanh thu theo từng tháng
   */
  private static calculateRevenueByMonth(paidInvoices: Invoice[], year: number) {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}/${year}`,
      revenue: 0
    }));

    paidInvoices
      .filter((invoice: Invoice) => invoice.year === year)
      .forEach((invoice: Invoice) => {
        const monthIndex = invoice.month - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex].revenue += invoice.totalAmount;
        }
      });

    return monthlyData;
  }

  /**
   * Tính doanh thu theo từng phòng
   */
  private static calculateRevenueByRoom(paidInvoices: Invoice[]) {
    const roomRevenue: { [key: string]: { revenue: number; roomTitle: string } } = {};

    paidInvoices.forEach((invoice: Invoice) => {
      if (!roomRevenue[invoice.roomId]) {
        roomRevenue[invoice.roomId] = { 
          revenue: 0, 
          roomTitle: `Phòng ${invoice.roomId}` 
        };
      }
      roomRevenue[invoice.roomId].revenue += invoice.totalAmount;
    });

    return Object.entries(roomRevenue)
      .map(([roomId, data]) => ({
        roomId,
        revenue: data.revenue,
        roomTitle: data.roomTitle
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Thống kê thanh toán chi tiết
   */
  static async calculatePaymentStats(): Promise<PaymentStats> {
    try {
      const invoicesRes = await axios.get(`${API}/invoices`);
      const invoices: Invoice[] = invoicesRes.data;

      const paidInvoices = invoices.filter((inv: Invoice) => inv.status === 'paid');
      const unpaidInvoices = invoices.filter((inv: Invoice) => inv.status === 'unpaid');
      const overdueInvoices = invoices.filter((inv: Invoice) => inv.status === 'overdue');

      const paidAmount = paidInvoices.reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);
      const unpaidAmount = unpaidInvoices.reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);
      const overdueAmount = overdueInvoices.reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);

      // Thanh toán theo tháng (12 tháng gần nhất)
      const currentYear = new Date().getFullYear();
      const invoicesByMonth = this.calculateInvoicesByMonth(paidInvoices, currentYear);

      return {
        totalInvoices: invoices.length,
        paidAmount,
        unpaidAmount,
        overdueAmount,
        invoicesByMonth
      };
    } catch (error) {
      console.error('Error calculating payment stats:', error);
      throw error;
    }
  }

  /**
   * Tính invoices theo tháng
   */
  private static calculateInvoicesByMonth(paidInvoices: Invoice[], year: number) {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: `Tháng ${i + 1}`,
      amount: 0
    }));

    paidInvoices
      .filter((invoice: Invoice) => invoice.year === year)
      .forEach((invoice: Invoice) => {
        const monthIndex = invoice.month - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex].amount += invoice.totalAmount;
        }
      });

    return monthlyData;
  }

  /**
   * Thống kê phòng chi tiết
   */
  static async calculateRoomStats(): Promise<RoomStats> {
    try {
      const [roomsRes, invoicesRes] = await Promise.all([
        axios.get(`${API}/rooms`),
        axios.get(`${API}/invoices`)
      ]);

      const rooms: Room[] = roomsRes.data;
      const invoices: Invoice[] = invoicesRes.data;

      const totalRooms = rooms.length;
      const rented = rooms.filter((room: Room) => room.tenant).length;
      const available = rooms.filter((room: Room) => !room.tenant).length;
      const maintenance = 0; // Không có trong database hiện tại

      const occupancyRate = totalRooms > 0 ? (rented / totalRooms) * 100 : 0;
      const averagePrice = totalRooms > 0 
        ? rooms.reduce((sum: number, room: Room) => sum + room.price, 0) / totalRooms 
        : 0;

      // Tổng doanh thu tiềm năng (nếu tất cả phòng đều được thuê)
      const totalPotentialRevenue = rooms.reduce((sum: number, room: Room) => sum + room.price, 0);

      // Doanh thu thực tế từ invoices đã thanh toán
      const paidInvoices = invoices.filter((inv: Invoice) => inv.status === 'paid');
      const actualRevenue = paidInvoices.reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);

      // Phòng theo trạng thái
      const roomsByStatus = [
        { status: 'Đã thuê', count: rented },
        { status: 'Còn trống', count: available },
        { status: 'Bảo trì', count: maintenance }
      ];

      return {
        totalRooms,
        available,
        rented,
        maintenance,
        occupancyRate,
        averagePrice,
        totalPotentialRevenue,
        actualRevenue,
        roomsByStatus
      };
    } catch (error) {
      console.error('Error calculating room stats:', error);
      throw error;
    }
  }

  /**
   * Tỷ lệ thu hồi nợ
   */
  static async calculateCollectionRate(): Promise<{ rate: number; details: any }> {
    try {
      const invoicesRes = await axios.get(`${API}/invoices`);
      const invoices: Invoice[] = invoicesRes.data;
      
      const totalInvoices = invoices.length;
      const paidInvoices = invoices.filter((inv: Invoice) => inv.status === 'paid').length;
      const unpaidInvoices = invoices.filter((inv: Invoice) => inv.status === 'unpaid').length;
      const overdueInvoices = invoices.filter((inv: Invoice) => inv.status === 'overdue').length;

      const collectionRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;

      return {
        rate: collectionRate,
        details: {
          total: totalInvoices,
          paid: paidInvoices,
          unpaid: unpaidInvoices,
          overdue: overdueInvoices
        }
      };
    } catch (error) {
      console.error('Error calculating collection rate:', error);
      throw error;
    }
  }

  /**
   * Dự báo doanh thu tháng tới dựa trên xu hướng
   */
  static async forecastNextMonthRevenue(): Promise<number> {
    try {
      const invoicesRes = await axios.get(`${API}/invoices`);
      const invoices: Invoice[] = invoicesRes.data;
      const currentYear = new Date().getFullYear();
      
      // Lấy doanh thu 3 tháng gần nhất để tính trung bình
      const recentMonths = [];
      const currentMonth = new Date().getMonth() + 1;
      
      for (let i = 2; i >= 0; i--) {
        let month = currentMonth - i;
        let year = currentYear;
        
        if (month <= 0) {
          month += 12;
          year -= 1;
        }
        
        const monthlyRevenue = invoices
          .filter((invoice: Invoice) => {
            if (invoice.status !== 'paid') return false;
            return invoice.month === month && invoice.year === year;
          })
          .reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);
          
        recentMonths.push(monthlyRevenue);
      }

      // Tính trung bình 3 tháng gần nhất
      const averageRevenue = recentMonths.length > 0 
        ? recentMonths.reduce((sum, revenue) => sum + revenue, 0) / recentMonths.length 
        : 0;

      return averageRevenue;
    } catch (error) {
      console.error('Error forecasting revenue:', error);
      throw error;
    }
  }

  /**
   * Tạo báo cáo thống kê tổng hợp
   */
  static async generateComprehensiveReport(): Promise<{
    revenue: RevenueData;
    payments: PaymentStats;
    rooms: RoomStats;
    collectionRate: { rate: number; details: any };
    forecast: number;
  }> {
    try {
      const [revenue, payments, rooms, collectionRate, forecast] = await Promise.all([
        this.calculateTotalRevenue(),
        this.calculatePaymentStats(),
        this.calculateRoomStats(),
        this.calculateCollectionRate(),
        this.forecastNextMonthRevenue()
      ]);

      return {
        revenue,
        payments,
        rooms,
        collectionRate,
        forecast
      };
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      throw error;
    }
  }

  /**
   * Lưu thống kê vào database (tùy chọn)
   */
  static async saveStatistics(): Promise<void> {
    try {
      const report = await this.generateComprehensiveReport();
      
      // Có thể lưu vào localStorage hoặc gửi lên server
      localStorage.setItem('revenue_statistics', JSON.stringify({
        ...report,
        savedAt: new Date().toISOString()
      }));
      
      console.log('Statistics saved successfully');
    } catch (error) {
      console.error('Error saving statistics:', error);
      throw error;
    }
  }
}

// Export các hàm tiện ích
export const calculateTotalRevenue = RevenueCalculator.calculateTotalRevenue;
export const calculatePaymentStats = RevenueCalculator.calculatePaymentStats;
export const calculateRoomStats = RevenueCalculator.calculateRoomStats;
export const calculateCollectionRate = RevenueCalculator.calculateCollectionRate;
export const forecastNextMonthRevenue = RevenueCalculator.forecastNextMonthRevenue;
export const generateComprehensiveReport = RevenueCalculator.generateComprehensiveReport;