import React, { useState, useEffect, FormEvent } from 'react';
import '../../css/ReportForm.css'

interface Report {
  id: string;
  postId: string;
  type: string;
  message: string;
  createdAt: string;
}

interface ReportFormProps {
  postId: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ postId }) => {
  const [type, setType] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('reports');
    if (stored) {
      const parsed: Report[] = JSON.parse(stored);
      setReports(parsed.filter(r => r.postId === postId));
    }
  }, [postId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!type || !message) return;

    const newReport: Report = {
      id: Date.now().toString(),
      postId,
      type,
      message,
      createdAt: new Date().toISOString(),
    };

    const allReports = [...reports, newReport];
    setReports(allReports);
    localStorage.setItem('reports', JSON.stringify([
      ...(JSON.parse(localStorage.getItem('reports') || '[]')),
      newReport
    ]));

    alert('✅ Phản ánh đã được gửi!');
    setType('');
    setMessage('');
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
                <strong>{r.type}</strong> - {r.message} <br />
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
