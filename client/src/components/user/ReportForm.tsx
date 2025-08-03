import React, { useState, useEffect, FormEvent } from 'react';
import '../../css/ReportForm.css';

interface Report {
  id?: string;
  roomId: string;
  type: string;
  message: string;
  createdAt: string;
}

interface ReportFormProps {
  roomId: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ roomId }) => {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/reports?roomId=${roomId}`)
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error('Lỗi khi lấy danh sách phản ánh:', err));
  }, [roomId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!type || !message) return;

    const newReport: Report = {
      roomId,
      type,
      message,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:3000/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });

      const saved = await response.json();
      setReports([...reports, saved]);

      alert('✅ Phản ánh đã được gửi!');
      setType('');
      setMessage('');
    } catch (err) {
      console.error('Lỗi khi gửi phản ánh:', err);
      alert('❌ Gửi phản ánh thất bại.');
    }
  };

  return (
    <div className="report-form">
      <h3>📩 Gửi phản ánh / Yêu cầu hỗ trợ</h3>

      <form onSubmit={handleSubmit}>
        <label>
          Loại phản ánh:
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">-- Chọn loại --</option>
            <option value="report">Phản ánh chất lượng phòng</option>
            <option value="support">Yêu cầu hỗ trợ từ hệ thống</option>
            <option value="owner">Phản ánh chủ trọ</option>
          </select>
        </label>

        <label>
          Nội dung phản ánh:
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Nhập nội dung phản ánh..."
          />
        </label>

        <button type="submit">Gửi phản ánh</button>
      </form>

      {reports.length > 0 && (
        <div className="report-history">
          <h4>📄 Các phản ánh đã gửi:</h4>
          <ul>
            {reports.map(r => (
              <li key={r.id}>
                <strong>{r.type}</strong> - {r.message}<br />
                <small>🕒 {new Date(r.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
