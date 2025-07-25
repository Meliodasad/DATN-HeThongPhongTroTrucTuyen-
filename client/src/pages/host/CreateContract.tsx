// 📁 src/pages/host/ContractCreate.tsx
// TRANG TẠO HỢP ĐỒNG MỚI
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../../services/hostService";

const ContractCreate = () => {
  const navigate = useNavigate();
  const [contract, setContract] = useState({
    tenantName: "",
    phone: "",
    roomId: "",
    startDate: "",
    endDate: "",
    deposit: "",
    monthlyRent: "",
    terms: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContract((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...contract,
      roomId: parseInt(contract.roomId),
      deposit: parseInt(contract.deposit),
      monthlyRent: parseInt(contract.monthlyRent),
    };

    hostService.createContract(dataToSubmit).then(() => {
      alert("Tạo hợp đồng thành công!");
      navigate("/host/contracts");
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        📝 Tạo Hợp Đồng Mới
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">👤 Họ tên người thuê:</label>
          <input
            name="tenantName"
            value={contract.tenantName}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">📞 Số điện thoại:</label>
          <input
            name="phone"
            value={contract.phone}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">🏠 ID Phòng:</label>
          <input
            name="roomId"
            value={contract.roomId}
            onChange={handleChange}
            required
            type="number"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">📅 Ngày bắt đầu:</label>
            <input
              name="startDate"
              value={contract.startDate}
              onChange={handleChange}
              type="date"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">📅 Ngày kết thúc:</label>
            <input
              name="endDate"
              value={contract.endDate}
              onChange={handleChange}
              type="date"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">💰 Tiền đặt cọc (VNĐ):</label>
          <input
            name="deposit"
            value={contract.deposit}
            onChange={handleChange}
            type="number"
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">📄 Điều khoản:</label>
          <textarea
            name="terms"
            value={contract.terms}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition duration-200"
        >
          ✅ Tạo Hợp Đồng
        </button>
      </form>
    </div>
  );
};

export default ContractCreate;
