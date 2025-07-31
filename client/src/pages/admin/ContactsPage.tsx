import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  User, 
  Calendar,
  Search,  
  Eye,
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
  Instagram,
  X
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { messageService } from '../../services/messageService';
import type { Message, MessageStats } from '../../types/message';

const ContactsPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats>({
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'faqs' | 'info'>('messages');

  const { success, error } = useToastContext();

  // Mock FAQs data
  const faqs = [
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
      answer: 'Sau khi đăng nhập với tài khoản Host, vào mục "Quản lý phòng", click "Thêm phòng mới", điền đầy đủ thông tin phòng trọ, upload hình ảnh và submit để admin duyệt.',
      category: 'Đăng tin',
      views: 2100,
      helpful: 1800
    },
    {
      id: 4,
      question: 'Phí dịch vụ là bao nhiều?',
      answer: 'Hiện tại dịch vụ hoàn toàn miễn phí cho người tìm phòng. Chủ trọ chỉ trả phí hoa hồng khi có giao dịch thành công.',
      category: 'Thanh toán',
      views: 1560,
      helpful: 1200
    },
    {
      id: 5,
      question: 'Làm thế nào để liên hệ với chủ trọ?',
      answer: 'Tại trang chi tiết phòng, bạn có thể click nút "Liên hệ" để gửi tin nhắn trực tiếp cho chủ trọ hoặc sử dụng số điện thoại được hiển thị.',
      category: 'Liên hệ',
      views: 1890,
      helpful: 1650
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [messagesData, statsData] = await Promise.all([
        messageService.getMessages(),
        messageService.getMessageStats()
      ]);
      setMessages(messagesData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải dữ liệu tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.receiver?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRead = readFilter === 'all' || 
                       (readFilter === 'read' && message.isRead) ||
                       (readFilter === 'unread' && !message.isRead);
    
    return matchesSearch && matchesRead;
  });

  const handleViewDetail = (message: Message) => {
    setSelectedMessage(message);
    setResponseText('');
    setIsDetailModalOpen(true);
    
    // Mark as read if unread
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, isRead: true } : m
      ));
      // Update stats
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    try {
      // Create a response message
      const responseMessage = {
        hostId: selectedMessage.hostId,
        tenantId: selectedMessage.tenantId,
        senderId: selectedMessage.receiverId, // Admin responds as the receiver
        receiverId: selectedMessage.senderId, // Send back to original sender
        message: responseText,
        time: new Date().toISOString(),
        isRead: false
      };

      await messageService.sendMessage(responseMessage);
      success('Thành công', 'Đã gửi phản hồi');
      setResponseText('');
      setIsDetailModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể gửi phản hồi');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;

    try {
      await messageService.deleteMessage(id);
      success('Thành công', 'Đã xóa tin nhắn');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể xóa tin nhắn');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessagePreview = (message: string) => {
    return message.length > 100 ? message.substring(0, 100) + '...' : message;
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
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chưa đọc</p>
              <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hôm nay</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.today}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tuần này</p>
              <p className="text-2xl font-bold text-green-600">{stats.thisWeek}</p>
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
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tin nhắn, người gửi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={readFilter}
                  onChange={(e) => setReadFilter(e.target.value as 'all' | 'read' | 'unread')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả tin nhắn</option>
                  <option value="unread">Chưa đọc</option>
                  <option value="read">Đã đọc</option>
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
                        Người nhận
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nội dung
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMessages.map((message) => (
                      <tr key={message.id} className={`hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                              {message.sender?.avatar ? (
                                <img 
                                  src={message.sender.avatar} 
                                  alt={message.sender.fullName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{message.sender?.fullName}</div>
                              <div className="text-sm text-gray-500">{message.sender?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                              {message.receiver?.avatar ? (
                                <img 
                                  src={message.receiver.avatar} 
                                  alt={message.receiver.fullName}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">{message.receiver?.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            <p className="line-clamp-2">{getMessagePreview(message.message)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            message.isRead 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {message.isRead ? 'Đã đọc' : 'Chưa đọc'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(message.time)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetail(message)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" 
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Không tìm thấy tin nhắn nào</p>
                  <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              )}
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Câu hỏi thường gặp</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
                        <p className="text-gray-600">support@rentalhub.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Địa chỉ</p>
                        <p className="text-gray-600">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <p className="text-gray-600">www.rentalhub.com</p>
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
                  <a href="#" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                    <span>Tải báo cáo</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span>Hướng dẫn sử dụng</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
              <div className="space-y-6">
                {/* Message Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Người gửi</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {selectedMessage.sender?.avatar ? (
                            <img 
                              src={selectedMessage.sender.avatar} 
                              alt={selectedMessage.sender.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedMessage.sender?.fullName}</p>
                          <p className="text-sm text-gray-500">{selectedMessage.sender?.email}</p>
                          {selectedMessage.sender?.phone && (
                            <p className="text-sm text-gray-500">{selectedMessage.sender.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Người nhận</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {selectedMessage.receiver?.avatar ? (
                            <img 
                              src={selectedMessage.receiver.avatar} 
                              alt={selectedMessage.receiver.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedMessage.receiver?.fullName}</p>
                          <p className="text-sm text-gray-500">{selectedMessage.receiver?.email}</p>
                          {selectedMessage.receiver?.phone && (
                            <p className="text-sm text-gray-500">{selectedMessage.receiver.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Thời gian: {formatDate(selectedMessage.time)}</span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedMessage.isRead 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedMessage.isRead ? 'Đã đọc' : 'Chưa đọc'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Nội dung tin nhắn</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Response Form */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Phản hồi tin nhắn</h4>
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
                      disabled={!responseText.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Gửi phản hồi
                    </button>
                    <button
                      onClick={() => setIsDetailModalOpen(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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

export default ContactsPage;