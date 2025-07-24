// src/pages/host/ContractDetail.tsx
// TRANG XEM CHI TIẾT HỢP ĐỒNG THUÊ PHÒNG
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { hostService } from "../../services/hostService";
import jsPDF from "jspdf";      // Thư viện tạo PDF 
import html2canvas from "html2canvas";      // Thư viện chuyển đổi HTML sang canvas

const ContractDetail = () => {
  const { id } = useParams();
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const fetchDetail = () => {
    setLoading(true);
    hostService
      .getContractById(id as string)
      .then((res) => setContract(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const exportToPDF = async () => {
    if (!contractRef.current) return;
    const canvas = await html2canvas(contractRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`hop_dong_${contract?.tenantName}.pdf`);
  };

  if (loading) return <p>Đang tải chi tiết hợp đồng...</p>;
  if (!contract) return <p>Không tìm thấy hợp đồng.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết hợp đồng thuê phòng</h2>

      <div ref={contractRef} style={{ background: "#fff", padding: 20, border: "1px solid #ccc" }}>
        <p><strong>ID:</strong> {contract.id}</p>
        <p><strong>Người thuê:</strong> {contract.tenantName}</p>
        <p><strong>SĐT:</strong> {contract.phone}</p>
        <p><strong>Phòng thuê:</strong> {contract.roomId}</p>
        <p><strong>Ngày bắt đầu:</strong> {contract.startDate}</p>
        <p><strong>Ngày kết thúc:</strong> {contract.endDate}</p>
        <p><strong>Tiền cọc:</strong> {contract.deposit.toLocaleString()}₫</p>
        <p><strong>Điều khoản:</strong></p>
        <p style={{ whiteSpace: "pre-line" }}>{contract.terms}</p>
      </div>

      <button onClick={exportToPDF} style={{ marginTop: 20 }}>
        Xuất file PDF
      </button>
    </div>
  );
};

export default ContractDetail;
