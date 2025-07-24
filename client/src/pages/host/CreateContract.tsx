// TRANG TẠO HỢP ĐỒNG THUÊ PHÒNG

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
      navigate("/host/contracts"); // trang danh sách hợp đồng
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Tạo Hợp Đồng Mới</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <label>Họ tên người thuê:</label>
          <input
            name="tenantName"
            value={contract.tenantName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>Số điện thoại:</label>
          <input
            name="phone"
            value={contract.phone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>ID Phòng:</label>
          <input
            name="roomId"
            value={contract.roomId}
            onChange={handleChange}
            required
            type="number"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>Ngày bắt đầu thuê:</label>
          <input
            name="startDate"
            value={contract.startDate}
            onChange={handleChange}
            type="date"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>Ngày bắt đầu thuê:</label>
          <input
            name="endDate"
            value={contract.endDate}
            onChange={handleChange}
            type="date"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>Tiền đặt cọc (VNĐ):</label>
          <input
            name="deposit"
            value={contract.deposit}
            onChange={handleChange}
            type="number"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        
        <div>
          <label>Điều khoản:</label>
          <textarea
            name="terms"
            value={contract.terms}
            onChange={handleChange}
            rows={4}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" style={{ padding: 10, backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
          Tạo hợp đồng
        </button>
      </form>
    </div>
  );
};

export default ContractCreate;
