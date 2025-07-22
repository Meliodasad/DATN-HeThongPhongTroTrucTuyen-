import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../src/pages/host/Header";
import Footer from "../src/pages/host/Footer";
import Profile from "../src/pages/host/Profile";
// import RoomStatus from "./pages/host/RoomStatus";
// import RentalRequests from "./pages/host/RentalRequests";
// import AssignTenant from "./pages/host/AssignTenant";
// import TenantList from "./pages/host/TenantList";
// import TerminateContract from "./pages/host/TerminateContract";
// import CreateContract from "./pages/host/CreateContract";
// import ExtendContract from "./pages/host/ExtendContract";
// import ContractHistory from "./pages/host/ContractHistory";
// import CreateInvoice from "./pages/host/CreateInvoice";
// import RevenueStats from "./pages/host/RevenueStats";
// import TotalRentedRooms from "./pages/host/TotalRentedRooms";
// import ExportReport from "./pages/host/ExportReport";
// import PaymentIntegration from "./pages/host/PaymentIntegration";
// import NotificationIntegration from "./pages/host/NotificationIntegration";
// import Logout from "./pages/host/Logout";

function App() {
  return (
    <Router>
      <Header />
      <main style={{ padding: "1rem" }}>
        <Routes>
          
          <Route path="/host/profile" element={<Profile />} />                                        {/* 1. Cập nhật thông tin cá nhân */}
          {/* <Route path="/host/room-status" element={<RoomStatus />} />                                 {/* 2. Quản lý trạng thái phòng */} 
          {/* <Route path="/host/rental-requests" element={<RentalRequests />} />                         3. Duyệt yêu cầu thuê phòng */}
          {/* <Route path="/host/assign-tenant" element={<AssignTenant />} />                             4. Gắn người thuê vào phòng         */}
          {/* <Route path="/host/tenant-list" element={<TenantList />} />                                 5. Danh sách người thuê hiện tại   */}
          {/* <Route path="/host/terminate-contract" element={<TerminateContract />} />                   6. Chấm dứt hợp đồng/Trả phòng */}
          {/* <Route path="/host/create-contract" element={<CreateContract />} />                         7. Tạo hợp đồng thuê */}
          {/* <Route path="/host/extend-contract" element={<ExtendContract />} />                         8. Gia hạn hợp đồng */}
          {/* <Route path="/host/contract-history" element={<ContractHistory />} />                       9. Xem lịch sử hợp đồng */}
          {/* <Route path="/host/create-invoice" element={<CreateInvoice />} />                           10. Tạo hóa đơn tiền phòng   */}
          {/* <Route path="/host/revenue-stats" element={<RevenueStats />} />                             11. Thống kê doanh thu */}
          {/* <Route path="/host/total-rented-rooms" element={<TotalRentedRooms />} />                    12. Tổng số phòng đã cho thuê */}
          {/* <Route path="/host/export-report" element={<ExportReport />} />                             13. Xuất Excel/PDF */}
          {/* <Route path="/host/payment-integration" element={<PaymentIntegration />} />                 14. Kết nối thanh toán */}
          {/* <Route path="/host/notification-integration" element={<NotificationIntegration />} />       15. Kết nối Zalo OA/Facebook */}
          {/* <Route path="/host/logout" element={<Logout />} />                                          16. Đăng xuất    */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;