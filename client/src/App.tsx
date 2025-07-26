// 📁 client/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "../src/pages/host/Profile";
import RoomStatus from "./pages/host/RoomStatus";
import RentalRequests from "./pages/host/RentalRequest";
import CreateContract from "./pages/host/CreateContract";
import ContractList from "./pages/host/ContractList";
import ContractDetail from "./pages/host/ContractDetail";
import UpdateProfile from "./pages/host/UpdateProfile";
import CreateRoom from "./pages/host/CreateRoom";
import RoomList from "./pages/host/RoomList";
import UpdateRoom from "./pages/host/UpdateRoom";
import HomepageLayout from "./components/HomePageLayout";

function App() {
  return (
    <Router>
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<HomepageLayout />}>
            <Route path="/host/profile" element={<Profile />} />                                        {/*thông tin cá nhân */}
            <Route path="/host/update-profile" element={<UpdateProfile />} />                            {/* . Cập nhật thông tin cá nhân */} 
            <Route path="/host/room-status" element={<RoomStatus />} />                                 {/* . Quản lý trạng thái phòng */} 
            <Route path="/host/rental-requests" element={<RentalRequests />} />                         {/*. Duyệt yêu cầu thuê phòng */}
            <Route path="/host/create-room" element={<CreateRoom />} />                              {/* Tạo phòng mới */}
            <Route path="/host/room-list" element={<RoomList />} />                                 {/* Danh sách phòng trọ */}
            <Route path="/host/update-room/:id" element={<UpdateRoom />} />                            {/* Sửa thông tin phòng */}  
            <Route path="/host/create-contract" element={<CreateContract />} />                         {/*. Tạo hợp đồng thuê */}
            <Route path="/host/contracts" element={<ContractList />} />                                   {/*. Xem lịch sử hợp đồng */}
            <Route path="/host/contracts/:id" element={<ContractDetail/>}/>                                {/*Xem chi tiết hợp đồng*/}
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;