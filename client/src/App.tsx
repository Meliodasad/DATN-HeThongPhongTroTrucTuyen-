// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/host/Dashboard";
import Profile from "./pages/host/Profile";
import UpdateProfile from "./pages/host/UpdateProfile";
import CreateRoom from "./pages/host/CreateRoom";
import UpdateRoom from "./pages/host/UpdateRoom";
import CreateContract from "./pages/host/CreateContract";
import ContractDetail from "./pages/host/ContractDetail";
import RoomStatus from "./pages/host/RoomStatus";
import RentalRequest from "./pages/host/RentalRequest";
import ContractList from "./pages/host/ContractList";
import RoomList from "./pages/host/RoomList";
import HomepageLayout from "./components/HomePageLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomepageLayout />}>
          <Route index element={<Navigate to="/host/dashboard" replace />} />
          <Route path="/host/dashboard" element={<Dashboard />} />
          <Route path="/host/profile" element={<Profile />} />
          <Route path="/host/update-profile" element={<UpdateProfile />} />
          <Route path="/host/room-list" element={<RoomList />} />
          <Route path="/host/create-room" element={<CreateRoom />} />
          <Route path="/host/update-room/:id" element={<UpdateRoom />} />
          <Route path="/host/room-status" element={<RoomStatus />} />
          <Route path="/host/rental-request" element={<RentalRequest />} />
          <Route path="/host/create-contract" element={<CreateContract />} />
          <Route path="/host/contracts" element={<ContractList />} />
          <Route path="/host/contracts/:id" element={<ContractDetail />} />
          <Route path="/host/logout" element={<div className="p-6"><h1>Đăng xuất (chưa hoàn thành)</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;