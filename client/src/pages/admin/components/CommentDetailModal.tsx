import React, { useState, useEffect } from 'react';
import { X, User, Calendar, MessageSquare, Send, Trash2 } from 'lucide-react';
import { useToastContext } from '../../../contexts/ToastContext';
import { commentService } from '../../../services/commentService';
import type { Comment, CommentReplyFormData } from '../../../types/comment';

interface CommentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentId: number | null;
}

const CommentDetailModal: React.FC<CommentDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  commentId 
}) => {
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyForm, setReplyForm] = useState<CommentReplyFormData>({
    content: '',
    author: 'Admin',
    authorEmail: 'admin@system.com',
    isAdmin: true
  });

  const { success, error } = useToastContext();

  useEffect(() => {
    if (isOpen && commentId) {
      loadComment();
    }
  }, [isOpen, commentId]);

  const loadComment = async () => {
    if (!commentId) return;
    
    try {
      setLoading(true);
      const commentData = await commentService.getCommentById(commentId);
      setComment(commentData);
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải chi tiết bình luận');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentId || !replyForm.content.trim()) return;

    try {
      setReplyLoading(true);
      await commentService.addReply(commentId, replyForm);
      success('Thành công', 'Đã thêm phản hồi');
      setReplyForm({
        content: '',
        author: 'Admin',
        authorEmail: 'admin@system.com',
        isAdmin: true
      });
      setShowReplyForm(false);
      await loadComment();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể thêm phản hồi');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    if (!commentId || !confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) return;

    try {
      await commentService.deleteReply(commentId, replyId);
      success('Thành công', 'Đã xóa phản hồi');
      await loadComment();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể xóa phản hồi');
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-500 ml-2">({rating}/5)</span>
      </div>
    );
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Chi tiết bình luận</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : comment ? (
            <div className="p-6 space-y-6">
              {/* Comment Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{comment.author}</h4>
                      <p className="text-sm text-gray-500">{comment.authorEmail}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{comment.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(comment.status)}`}>
                    {getStatusText(comment.status)}
                  </span>
                </div>

                {/* Room Info */}
                <div className="mb-4 p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">Phòng trọ:</p>
                  <p className="font-medium text-gray-900">{comment.roomTitle}</p>
                </div>

                {/* Rating */}
                {comment.rating && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Đánh giá:</p>
                    {renderStars(comment.rating)}
                  </div>
                )}

                {/* Comment Content */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nội dung bình luận:</p>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-900 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </div>

              {/* Replies Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Phản hồi ({comment.replies?.length || 0})
                  </h5>
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Thêm phản hồi
                  </button>
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                  <form onSubmit={handleSubmitReply} className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên người trả lời
                        </label>
                        <input
                          type="text"
                          value={replyForm.author}
                          onChange={(e) => setReplyForm(prev => ({ ...prev, author: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={replyForm.authorEmail}
                          onChange={(e) => setReplyForm(prev => ({ ...prev, authorEmail: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung phản hồi
                      </label>
                      <textarea
                        value={replyForm.content}
                        onChange={(e) => setReplyForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập nội dung phản hồi..."
                        required
                      />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={replyForm.isAdmin}
                          onChange={(e) => setReplyForm(prev => ({ ...prev, isAdmin: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Trả lời với tư cách Admin</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={replyLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {replyLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReplyForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}

                {/* Replies List */}
                <div className="space-y-4">
                  {comment.replies && comment.replies.length > 0 ? (
                    comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded-lg p-4 ml-8">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              reply.isAdmin ? 'bg-blue-100' : 'bg-gray-200'
                            }`}>
                              <User className={`w-4 h-4 ${reply.isAdmin ? 'text-blue-600' : 'text-gray-500'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{reply.author}</span>
                                {reply.isAdmin && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{reply.authorEmail}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{reply.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Xóa phản hồi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3 ml-11">
                          <p className="text-gray-900">{reply.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>Chưa có phản hồi nào</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Không tìm thấy bình luận</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDetailModal;