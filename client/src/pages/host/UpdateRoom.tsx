// Sửa thông tin phòng
// ../client/src/pages/host/UpdateRoom.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hostService } from "../../services/hostService";

export default function UpdateRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    area: 0,
    price: 0,
    utilities: "",
    maxPeople: 1,
    image: "",
    description: "",
    location: "",
    deposit: "",
    electricity: "",
  });

  // Gọi API để lấy thông tin phòng theo id
  useEffect(() => {
    if (id) {
      hostService.getRoomById(Number(id))
        .then((res) => setFormData(res.data))
        .catch(() => alert("❌ Không tìm thấy thông tin phòng."));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await hostService.updateRoom(Number(id), formData);
      alert("✅ Cập nhật phòng thành công!");
      navigate("/host/room-list");
    } catch (error) {
      alert("❌ Cập nhật phòng thất bại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🛠 Cập nhật thông tin phòng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Mã phòng</label>
          <input type="text" name="code" value={formData.code} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" required />
        </div>
        <div>
          <label className="block font-medium">Giá phòng (VNĐ)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" required />
        </div>
        <div>
          <label className="block font-medium">Diện tích (m²)</label>
          <input type="number" name="area" value={formData.area} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" required />
        </div>
        <div>
          <label className="block font-medium">Tiện ích</label>
          <input type="text" name="utilities" value={formData.utilities} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Số người tối đa</label>
          <input type="number" name="maxPeople" value={formData.maxPeople} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Ảnh phòng (URL)</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Mô tả chi tiết</label>
          <textarea name="description" value={formData.description} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" rows={3}></textarea>
        </div>
        <div>
          <label className="block font-medium">Địa chỉ phòng</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Tiền cọc</label>
          <input type="text" name="deposit" value={formData.deposit} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Giá điện/nước</label>
          <input type="text" name="electricity" value={formData.electricity} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            💾 Cập nhật phòng
          </button>
        </div>
      </form>
    </div>
  );
}
