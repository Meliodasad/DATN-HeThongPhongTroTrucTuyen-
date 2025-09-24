import '../../css/SidebarLeft.css';
import db from '../../../db.json';
import { useSearch } from '../../contexts/SearchContext';



const SidebarLeft = () => {
  const roomCount = db.rooms.length;
  const { setSearchRoom } = useSearch();
  return (
    <div className="sidebar-left-container">
      <h2 className="sidebar-left-title">
        Kênh thông tin Phòng Trọ số 1 Việt Nam
      </h2>

      <p className="sidebar-left-subtitle">
        Có {roomCount.toLocaleString()} tin đăng cho thuê
      </p>

      <p className="sidebar-left-bold-text">TỈNH THÀNH</p>

      <div className="sidebar-left-buttons">
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Hồ Chí Minh' }))} className="sidebar-left-button">Phòng trọ Hồ Chí Minh</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Hà Nội' }))} className="sidebar-left-button">Phòng trọ Hà Nội</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Đà Nẵng</button>
        <button onClick={() => setSearchRoom((pre: any) => ({  }))} className="sidebar-left-button all">
          Tất cả <span>›</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarLeft;
