// 📁 src/pages/host/ContractDetail.tsx
// Trang xem chi tiết hợp đồng thuê phòng
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { hostService } from "../../services/hostService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ContractDetail = () => {
  const { id } = useParams();
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    hostService
      .getContractById(id as string)
      .then((res) => setContract(res.data))
      .finally(() => setLoading(false));
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

  if (loading) return <p className="text-center mt-10 text-gray-500">Đang tải chi tiết hợp đồng...</p>;
  if (!contract) return <p className="text-center mt-10 text-red-500">Không tìm thấy hợp đồng.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        📑 Chi tiết hợp đồng thuê phòng
      </h2>

      <div
        ref={contractRef}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3"
      >
        <p><strong className="text-gray-600">ID:</strong> {contract.id}</p>
        <p><strong className="text-gray-600">👤 Người thuê:</strong> {contract.tenantName}</p>
        <p><strong className="text-gray-600">📞 SĐT:</strong> {contract.phone}</p>
        <p><strong className="text-gray-600">🏠 Phòng thuê:</strong> {contract.roomId}</p>
        <p><strong className="text-gray-600">📅 Ngày bắt đầu:</strong> {contract.startDate}</p>
        <p><strong className="text-gray-600">📅 Ngày kết thúc:</strong> {contract.endDate}</p>
        <p><strong className="text-gray-600">💰 Tiền cọc:</strong> {contract.deposit.toLocaleString()}₫</p>
        <div>
          <strong className="text-gray-600">📜 Điều khoản:</strong>
          <p className="whitespace-pre-line mt-1">{contract.terms}</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={exportToPDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow transition-all"
        >
          📤 Xuất file PDF
        </button>
      </div>
    </div>
  );
};

export default ContractDetail;
