import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import type { PhongTro } from "../../types/Phongtro";

const initData: PhongTro = {
  id: "",
  tieu_de: "",
  dia_chi: "",
  gia_thue: 0,
  dien_tich: 0,
  mo_ta: "",
  hinh_anh: [],
  trang_thai: "con_trong",
  chu_tro_id: 2, // hoặc có thể set dựa vào tài khoản đăng nhập
};

const PhongTroAdd = () => {
  const [formData, setFormData] = useState<PhongTro>(initData);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "gia_thue" || name === "dien_tich" ? Number(value) : value,
    });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const images = e.target.value.split(",").map((img) => img.trim());
    setFormData({ ...formData, hinh_anh: images });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newId = Date.now().toString(); // tạo id ngẫu nhiên
      const newPhong: PhongTro = { ...formData, id: newId };

      await axios.post("/phong_tro", newPhong);
      alert("Thêm phòng trọ thành công!");
      navigate("/dashboard/phong-tro");
    } catch (err) {
        console.error("Error adding room:", err);
      alert("Có lỗi xảy ra khi thêm phòng trọ.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">➕ Thêm mới phòng trọ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tiêu đề</label>
          <input
            name="tieu_de"
            value={formData.tieu_de}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Địa chỉ</label>
          <input
            name="dia_chi"
            value={formData.dia_chi}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Giá thuê (VND)</label>
            <input
              type="number"
              name="gia_thue"
              value={formData.gia_thue}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Diện tích (m²)</label>
            <input
              type="number"
              name="dien_tich"
              value={formData.dien_tich}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Mô tả</label>
          <textarea
            name="mo_ta"
            value={formData.mo_ta}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Hình ảnh (ngăn cách dấu phẩy)</label>
          <input
            type="text"
            value={formData.hinh_anh.join(",")}
            onChange={handleImagesChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Trạng thái</label>
          <select
            name="trang_thai"
            value={formData.trang_thai}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="con_trong">Còn trống</option>
            <option value="da_thue">Đã thuê</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/phong-tro")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Thêm phòng
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhongTroAdd;
