import { useEffect, useState } from "react";
import axios from '../../services/axios';
import type { PhongTro } from '../../types/Phongtro';
import { Link } from "react-router-dom";

const PhongTroList = () => {
  const [phongs, setPhongs] = useState<PhongTro[]>([]);

  const fetchData = async () => {
    const res = await axios.get("/phong_tro");
    setPhongs(res.data);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xoá phòng trọ này?");
    if (!confirmDelete) return;

    await axios.delete(`/phong_tro/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">📋 Danh sách phòng trọ</h2>
        <Link
          to="/dashboard/phong-tro/add"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Thêm phòng trọ
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {phongs.map((phong) => (
          <div key={phong.id} className="bg-gray-100 rounded shadow p-4 relative">
            <img
              src={phong.hinh_anh?.[0] || "/no-image.jpg"}
              alt={phong.tieu_de}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{phong.tieu_de}</h3>
            <p className="text-sm text-gray-600">{phong.dia_chi}</p>
            <p className="text-sm text-gray-800 font-medium">
              Giá: {phong.gia_thue.toLocaleString()} VND
            </p>
            <p className="text-sm text-gray-500">Diện tích: {phong.dien_tich} m²</p>
            
            {/* Trạng thái thuê */}
            <p className={`text-sm font-semibold mt-1 ${
              phong.trang_thai === 'con_trong' ? 'text-green-600' : 'text-red-500'
            }`}>
              {phong.trang_thai === 'con_trong' ? 'Còn trống' : 'Đã thuê'}
            </p>

            <div className="flex justify-end mt-4 space-x-2">
              <Link
                to={`/dashboard/phong-tro/edit/${phong.id}`}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Sửa
              </Link>

              <button
                onClick={() => handleDelete(phong.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhongTroList;
