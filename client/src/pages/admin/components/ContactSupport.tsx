import React, { useState, useEffect } from 'react';

import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  User, 
  Calendar,
  Search,  Eye,
  Trash2,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  Download,
  Star,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { useToastContext } from '../../../contexts/ToastContext';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'support' | 'complaint' | 'suggestion' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  response?: string;
  responseAt?: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
}

const ContactSupport: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactMessage['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContactMessage['type'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ContactMessage['priority'] | 'all'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'faqs' | 'info'>('messages');

  const { success, error } = useToastContext();

  // Mock data
  const mockMessages: ContactMessage[] = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      subject: 'Không thể đăng nhập vào tài khoản',
      message: 'Tôi đã thử đăng nhập nhiều lần nhưng hệ thống báo lỗi. Xin hãy hỗ trợ tôi.',
      type: 'support',
      priority: 'high',
      status: 'new',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0912345678',
      subject: 'Phòng trọ không đúng như mô tả',
      message: 'Phòng tôi thuê không giống như hình ảnh và mô tả trên website. Tôi muốn khiếu nại.',
      type: 'complaint',
      priority: 'urgent',
      status: 'in-progress',
      createdAt: '2024-01-19',
      updatedAt: '2024-01-20',
      assignedTo: 'Admin Support',
      response: 'Chúng tôi đã tiếp nhận khiếu nại và sẽ kiểm tra trong 24h.',
      responseAt: '2024-01-20'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      subject: 'Đề xuất cải thiện giao diện',
      message: 'Tôi nghĩ giao diện tìm kiếm có thể được cải thiện để dễ sử dụng hơn.',
      type: 'suggestion',
      priority: 'low',
      status: 'resolved',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19',
      assignedTo: 'Product Team',
      response: 'Cảm ơn góp ý của bạn. Chúng tôi sẽ cân nhắc trong bản cập nhật tiếp theo.',
      responseAt: '2024-01-19'
    }
  ];

  const mockFAQs: FAQ[] = [
    {
      id: 1,
      question: 'Làm thế nào để đăng ký tài khoản?',
      answer: 'Bạn có thể đăng ký tài khoản bằng cách click vào nút "Đăng ký" ở góc phải màn hình, sau đó điền đầy đủ thông tin cá nhân và xác thực email.',
      category: 'Tài khoản',
      views: 1250,
      helpful: 980
    },
    {
      id: 2,
      question: 'Tôi quên mật khẩu, phải làm sao?',
      answer: 'Tại trang đăng nhập, click vào "Quên mật khẩu", nhập email đã đăng ký và làm theo hướng dẫn trong email được gửi đến.',
      category: 'Tài khoản',
      views: 890,
      helpful: 750
    },
    {
      id: 3,
      question: 'Làm thế nào để đăng tin cho thuê phòng?',
      answer: 'Sau khi đăng nhập, vào mục "Đăng tin", điền đầy đủ thông tin phòng trọ, upload hình ảnh và submit để admin duyệt.',
      category: 'Đăng tin',
      views: 2100,
      helpful: 1800
    },
    {
      id: 4,
      question: 'Phí dịch vụ là bao nhiều?',
      answer: 'Hiện tại dịch vụ hoàn toàn miễn phí cho người tìm phòng. Chủ trọ chỉ trả phí khi có giao dịch thành công.',
      category: 'Thanh toán',
      views: 1560,
      helpful: 1200
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(mockMessages);
      setFaqs(mockFAQs);
    } catch (err) {
        console.error(err);
      error('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesType = typeFilter === 'all' || message.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const handleViewDetail = (message: ContactMessage) => {
    setSelectedMessage(message);
    setResponseText(message.response || '');
    setIsDetailModalOpen(true);
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedMessage = {
        ...selectedMessage,
        response: responseText,
        responseAt: new Date().toISOString().split('T')[0],
        status: 'resolved' as const,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? updatedMessage : m));
      setSelectedMessage(updatedMessage);
      success('Thành công', 'Đã gửi phản hồi');
    } catch (err) {
        console.error(err);
      error('Lỗi', 'Không thể gửi phản hồi');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;

    try {
      setMessages(prev => prev.filter(m => m.id !== id));
      success('Thành công', 'Đã xóa tin nhắn');
    } catch (err) {
        console.error(err);
      error('Lỗi', 'Không thể xóa tin nhắn');
    }
  };

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new': return 'Mới';
      case 'in-progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  const getPriorityColor = (priority: ContactMessage['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: ContactMessage['priority']) => {
    switch (priority) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      case 'urgent': return 'Khẩn cấp';
      default: return 'Không xác định';
    }
  };

  const getTypeText = (type: ContactMessage['type']) => {
    switch (type) {
      case 'support': return 'Hỗ trợ';
      case 'complaint': return 'Khiếu nại';
      case 'suggestion': return 'Góp ý';
      case 'general': return 'Chung';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liên hệ & Hỗ trợ</h1>
          <p className="text-gray-600">Quản lý tin nhắn liên hệ và hỗ trợ khách hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tin nhắn</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {messages.filter(m => m.status === 'new' || m.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã giải quyết</p>
              <p className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khẩn cấp</p>
              <p className="text-2xl font-bold text-red-600">
                {messages.filter(m => m.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Tin nhắn liên hệ
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'faqs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <HelpCircle className="w-4 h-4 inline mr-2" />
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Thông tin liên hệ
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tin nhắn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ContactMessage['status'] | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="new">Mới</option>
                  <option value="in-progress">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="closed">Đã đóng</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as ContactMessage['type'] | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="support">Hỗ trợ</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="suggestion">Góp ý</option>
                  <option value="general">Chung</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as ContactMessage['priority'] | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả mức độ</option>
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>

              {/* Messages Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người gửi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mức độ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMessages.map((message) => (
                      <tr key={message.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{message.name}</div>
                              <div className="text-sm text-gray-500">{message.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{message.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{getTypeText(message.type)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                            {getPriorityText(message.priority)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                            {getStatusText(message.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {message.createdAt}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetail(message)}
                              className="text-blue-600 hover:text-blue-900" 
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Xóa tin nhắn"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMessages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không tìm thấy tin nhắn nào</p>
                </div>
              )}
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Câu hỏi thường gặp</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Thêm FAQ mới
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h4>
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{faq.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{faq.helpful}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Thông tin liên hệ</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Hotline</p>
                        <p className="text-gray-600">1900 1234 (24/7)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">support@phongtro.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Địa chỉ</p>
                        <p className="text-gray-600">123 Nguyễn Huệ, Q1, TP.HCM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <p className="text-gray-600">www.phongtro.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Giờ làm việc</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thứ 2 - Thứ 6</span>
                      <span className="font-medium text-gray-900">8:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thứ 7</span>
                      <span className="font-medium text-gray-900">8:00 - 12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chủ nhật</span>
                      <span className="font-medium text-gray-900">Nghỉ</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hotline 24/7</span>
                        <span className="font-medium text-green-600">Luôn sẵn sàng</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Mạng xã hội</h3>
                <div className="flex items-center gap-4">
                  <a href="#" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4 text-gray-600" />
                    <span>Tải báo cáo</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span>Hướng dẫn sử dụng</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span>Chat trực tiếp</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {isDetailModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Chi tiết tin nhắn</h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
<User className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
              <div className="space-y-6">
                {/* Message Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Thông tin người gửi</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Tên:</span>
                          <p className="font-medium">{selectedMessage.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Email:</span>
                          <p className="font-medium">{selectedMessage.email}</p>
                        </div>
                        {selectedMessage.phone && (
                          <div>
                            <span className="text-sm text-gray-600">Điện thoại:</span>
                            <p className="font-medium">{selectedMessage.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Thông tin tin nhắn</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Loại:</span>
                          <p className="font-medium">{getTypeText(selectedMessage.type)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Mức độ:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getPriorityColor(selectedMessage.priority)}`}>
                            {getPriorityText(selectedMessage.priority)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Trạng thái:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getStatusColor(selectedMessage.status)}`}>
                            {getStatusText(selectedMessage.status)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Ngày tạo:</span>
                          <p className="font-medium">{selectedMessage.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject and Message */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tiêu đề</h4>
                  <p className="text-lg text-gray-900 mb-4">{selectedMessage.subject}</p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Nội dung</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Existing Response */}
                {selectedMessage.response && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Phản hồi hiện tại</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-900">{selectedMessage.response}</p>
                      <p className="text-sm text-blue-600 mt-2">
                        Phản hồi bởi: {selectedMessage.assignedTo || 'Admin'} - {selectedMessage.responseAt}
                      </p>
                    </div>
                  </div>
                )}

                {/* Response Form */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {selectedMessage.response ? 'Cập nhật phản hồi' : 'Thêm phản hồi'}
                  </h4>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập phản hồi của bạn..."
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSendResponse}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Gửi phản hồi
                    </button>
                    <button
                      onClick={() => setIsDetailModalOpen(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSupport;