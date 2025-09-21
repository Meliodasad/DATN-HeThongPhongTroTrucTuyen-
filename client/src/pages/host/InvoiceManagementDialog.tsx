import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

const InvoiceManagementDialog = ({ 
  isOpen, 
  onClose, 
  contractId, 
  roomId, 
  userId,
  onInvoiceCreated 
}) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentType, setFilterPaymentType] = useState('all');

  const [formData, setFormData] = useState({
    paymentType: 'room',
    amount: '',
    status: 'pending',
    note: ''
  });

  const paymentTypes = [
    { value: 'room', label: 'Tiền thuê' },
    { value: 'electricity', label: 'Tiền điện' },
    { value: 'water', label: 'Tiền nước' },
    { value: 'service', label: 'Phí dịch vụ' },
    { value: 'other', label: 'Khác' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
    { value: 'unpaid', label: 'Quá hạn', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen, contractId]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Fetch invoices by contract
      const response = await fetch(`${API_BASE_URL}/invoices/contract/${contractId}`);
      const data = await response.json();
      if (data.success) {
        setInvoices(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!formData.paymentType || !formData.amount) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractId,
          roomId,
          userId,
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      });

      const data = await response.json();
      if (data.success) {
        setInvoices((prev: any) => [data.data, ...prev]);
        setShowCreateForm(false);
        setFormData({
          paymentType: 'room',
          amount: '',
          status: 'pending',
          note: ''
        });
        onInvoiceCreated && onInvoiceCreated(data.data);
      } else {
        alert(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Có lỗi xảy ra khi tạo hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInvoice = async () => {
    if (!formData.paymentType || !formData.amount) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${contractId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractId,
          roomId,
          userId,
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      });

      const data = await response.json();
      if (data.success) {
        setInvoices(prev => prev.map(inv => 
          inv.id === editingInvoice.id ? data.data : inv
        ));
        setEditingInvoice(null);
        setFormData({
          paymentType: 'room',
          amount: '',
          status: 'pending',
          note: ''
        });
      } else {
        alert(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Có lỗi xảy ra khi cập nhật hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      } else {
        alert(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Có lỗi xảy ra khi xóa hóa đơn');
    } finally {
      fetchInvoices()
      setLoading(false);
    }
  };

  const startEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      paymentType: invoice.paymentType,
      amount: invoice.amount.toString(),
      status: invoice.status,
      note: invoice.note || ''
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingInvoice(null);
    setFormData({
      paymentType: 'room',
      amount: '',
      status: 'pending',
      note: ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getPaymentTypeLabel = (type) => {
    return paymentTypes.find(t => t.value === type)?.label || type;
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getPaymentTypeLabel(invoice.paymentType).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesPaymentType = filterPaymentType === 'all' || invoice.paymentType === filterPaymentType;
    
    return matchesSearch && matchesStatus && matchesPaymentType;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Quản lý hóa đơn - Hợp đồng #{contractId}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hóa đơn..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterPaymentType}
              onChange={(e) => setFilterPaymentType(e.target.value)}
            >
              <option value="all">Tất cả loại thanh toán</option>
              {paymentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingInvoice(null);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tạo hóa đơn
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Invoice List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Đang tải...</p>
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Chưa có hóa đơn nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredInvoices.map((invoice) => {
                      const statusInfo = getStatusInfo(invoice.status);
                      return (
                        <div
                          key={invoice.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-gray-800">
                                  {getPaymentTypeLabel(invoice.paymentType)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              
                              <div className="text-2xl font-bold text-blue-600 mb-2">
                                {formatCurrency(invoice.amount)}
                              </div>
                              
                              {invoice.note && (
                                <p className="text-sm text-gray-600 mb-2">{invoice.note}</p>
                              )}
                              
                              <div className="text-xs text-gray-500">
                                ID: {invoice.id} • Tạo: {new Date(invoice.createdAt).toLocaleString('vi-VN')}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDeleteInvoice(invoice.invoiceId)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Form Panel */}
            {(showCreateForm || editingInvoice) && (
              <div className="w-96 border-l border-gray-200 bg-gray-50">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-800">
                      {editingInvoice ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        cancelEdit();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại thanh toán *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.paymentType}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentType: e.target.value }))}
                      >
                        {paymentTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số tiền *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Nhập số tiền"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú
                      </label>
                      <textarea
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.note}
                        onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                        placeholder="Nhập ghi chú..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Đang xử lý...' : (editingInvoice ? 'Cập nhật' : 'Tạo hóa đơn')}
                      </button>
                      {editingInvoice && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Tổng: {filteredInvoices.length} hóa đơn</span>
            <span>
              Tổng tiền: {formatCurrency(
                filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagementDialog;