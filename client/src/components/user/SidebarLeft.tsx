import '../../css/SidebarLeft.css';
import db from '../../../db.json';
import { useSearch } from '../../contexts/SearchContext';



const SidebarLeft = () => {
  const roomCount = db.rooms.length;
  const { setSearchRoom } = useSearch();
  return (
    <div className="sidebar-left-container">
      <h2 className="sidebar-left-title">
        Kênh thông tin Phòng Trọ Thông Minh
      </h2>

      <p className="sidebar-left-bold-text">CÁC QUẬN HÀ NỘI</p>

      <div className="sidebar-left-buttons">
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Hồ Chí Minh' }))} className="sidebar-left-button">Phòng trọ Bắc Từ Liêm</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Hà Nội' }))} className="sidebar-left-button">Phòng trọ Nam Từ Liêm</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Cầu Giấy</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Cầu Diễn</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Láng</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Hà Đông</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Ba Đình</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Hai Bà Trưng</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Thanh Xuân</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Hoàng Mai</button>
        <button onClick={() => setSearchRoom((pre: any) => ({ ...pre, location: 'Đà Nẵng' }))} className="sidebar-left-button">Phòng trọ Long Biên</button>
        <button onClick={() => setSearchRoom((pre: any) => ({  }))} className="sidebar-left-button all">
          Tất cả <span>›</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarLeft;
