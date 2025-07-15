import React, { useState, useEffect, useMemo } from 'react';
import { MessageSquare, User, Calendar, MoreVertical, Eye, Trash2, Flag, Check, X, Clock } from 'lucide-react';
import { useToastContext } from '../../../contexts/ToastContext';
import type { Comment, CommentStats } from '../../../types/comment';
import CommentDetailModal from './CommentDetailModal';

const CommentManagement: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Comment['status'] | 'all'>('all');
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { success, error } = useToastContext();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/db.json');
      const data = await response.json();
      setComments(data.comments);
      
      // Calculate stats
      const total = data.comments.length;
      const approved = data.comments.filter((c: Comment) => c.status === 'approved').length;
      const pending = data.comments.filter((c: Comment) => c.status === 'pending').length;
      const rejected = data.comments.filter((c: Comment) => c.status === 'rejected').length;
      
      const averageRating = data.comments.reduce((sum: number, c: Comment) => sum + (c.rating || 0), 0) / data.comments.filter((c: Comment) => c.rating).length;

      setStats({
        total,
        approved,
        pending,
        rejected,
        averageRating: Math.round(averageRating * 10) / 10
      });
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải dữ liệu bình luận');
    } finally {
      setLoading(false);
    }
  };

  const filteredComments = useMemo(() => {
    return comments.filter(comment => {
      const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comment.roomTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [comments, searchTerm, statusFilter]);

  const handleUpdateStatus = async (id: number, status: Comment['status']) => {
    try {
      success('Thành công', `${status === 'approved' ? 'Duyệt' : status === 'rejected' ? 'Từ chối' : 'Cập nhật'} bình luận thành công`);
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể cập nhật trạng thái bình luận');
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    try {
      success('Thành công', 'Xóa bình luận thành công');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể xóa bình luận');
    }
  };

  const handleViewDetail = (commentId: number) => {
    setSelectedCommentId(commentId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCommentId(null);
    loadData();
  };

  const getStatusColor = (status: Comment['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Comment['status']) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return 'Không xác định';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating}/5)</span>
      </div>
    );
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng bình luận</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Từ chối</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">★</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageRating}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm bình luận, tác giả hoặc phòng trọ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Comment['status'] | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Danh sách bình luận ({filteredComments.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng trọ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
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
              {filteredComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{comment.author}</div>
                        <div className="text-sm text-gray-500">{comment.authorEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      <p className="line-clamp-2">{comment.content}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{comment.roomTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(comment.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(comment.status)}`}>
                      {getStatusText(comment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {comment.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {comment.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(comment.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Duyệt bình luận"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Từ chối bình luận"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleViewDetail(comment.id)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900" title="Báo cáo">
                        <Flag className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa bình luận"
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

        {filteredComments.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy bình luận nào</p>
          </div>
        )}
      </div>

      {/* Comment Detail Modal */}
      <CommentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        commentId={selectedCommentId}
      />
    </div>
  );
};

export default CommentManagement;