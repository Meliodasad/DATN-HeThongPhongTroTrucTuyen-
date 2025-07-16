import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Star, 
  Shield, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Check,
  AlertTriangle,
  Image as ImageIcon,
  Plus,
  Minus
} from 'lucide-react';
import { useToastContext } from '../../../contexts/ToastContext';
import { reviewService } from '../../../services/reviewService';
import type { Review, AdminResponse } from '../../../types/review';

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: number | null;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  reviewId 
}) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseForm, setResponseForm] = useState<AdminResponse>({
    content: '',
    respondedBy: 'Admin'
  });

  const { success, error } = useToastContext();

  useEffect(() => {
    if (isOpen && reviewId) {
      loadReview();
    }
  }, [isOpen, reviewId]);

  const loadReview = async () => {
    if (!reviewId) return;
    
    try {
      setLoading(true);
      const reviewData = await reviewService.getReviewById(reviewId);
      setReview(reviewData);
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải chi tiết đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewId || !responseForm.content.trim()) return;

    try {
      setResponseLoading(true);
      await reviewService.addAdminResponse(reviewId, responseForm);
      success('Thành công', 'Đã thêm phản hồi admin');
      setResponseForm({
        content: '',
        respondedBy: 'Admin'
      });
      setShowResponseForm(false);
      await loadReview();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể thêm phản hồi');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleUpdateHelpful = async (increment: boolean) => {
    if (!reviewId) return;

    try {
      await reviewService.updateHelpfulCount(reviewId, increment);
      success('Thành công', `${increment ? 'Tăng' : 'Giảm'} lượt hữu ích`);
      await loadReview();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể cập nhật lượt hữu ích');
    }
  };

  const handleUpdateStatus = async (status: Review['status']) => {
    if (!reviewId) return;

    try {
      await reviewService.updateReviewStatus(reviewId, status);
      success('Thành công', `${status === 'approved' ? 'Duyệt' : 'Từ chối'} đánh giá thành công`);
      await loadReview();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const handleVerifyReview = async (isVerified: boolean) => {
    if (!reviewId) return;

    try {
      await reviewService.verifyReview(reviewId, isVerified);
      success('Thành công', `${isVerified ? 'Xác thực' : 'Hủy xác thực'} đánh giá thành công`);
      await loadReview();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể cập nhật trạng thái xác thực');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-lg font-medium text-gray-700 ml-2">({rating}/5)</span>
      </div>
    );
  };

  const getStatusColor = (status: Review['status']) => {
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

  const getStatusText = (status: Review['status']) => {
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
          <h3 className="text-xl font-semibold text-gray-900">Chi tiết đánh giá</h3>
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
          ) : review ? (
            <div className="p-6 space-y-6">
              {/* Review Header */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                        {review.isVerified && (
                          <Shield className="w-5 h-5 text-green-500" title="Đã xác thực" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{review.userEmail}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{review.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(review.status)}`}>
                      {getStatusText(review.status)}
                    </span>
                  </div>
                </div>

                {/* Room Info */}
                <div className="mb-4 p-4 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600 mb-1">Phòng trọ:</p>
                  <p className="font-medium text-gray-900">{review.roomTitle}</p>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Đánh giá:</p>
                  {renderStars(review.rating)}
                </div>

                {/* Review Title */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Tiêu đề:</p>
                  <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Nội dung đánh giá:</p>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{review.content}</p>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <Check className="w-4 h-4 text-green-500" />
                        Ưu điểm:
                      </p>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <ul className="space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {review.cons.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Nhược điểm:
                      </p>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <ul className="space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Images */}
                {review.images && review.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      Hình ảnh đính kèm:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{review.helpfulCount} người thấy hữu ích</span>
                    </div>
                    {review.isRecommended && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        <span>Khuyến nghị</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Thao tác quản trị</h5>
                <div className="flex flex-wrap gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus('approved')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Duyệt đánh giá
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('rejected')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Từ chối
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleVerifyReview(!review.isVerified)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      review.isVerified 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    {review.isVerified ? 'Hủy xác thực' : 'Xác thực'}
                  </button>

                  <button
                    onClick={() => handleUpdateHelpful(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tăng hữu ích
                  </button>

                  <button
                    onClick={() => handleUpdateHelpful(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Minus className="w-4 h-4" />
                    Giảm hữu ích
                  </button>
                </div>
              </div>

              {/* Admin Response Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Phản hồi từ Admin
                  </h5>
                  {!review.adminResponse && (
                    <button
                      onClick={() => setShowResponseForm(!showResponseForm)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Thêm phản hồi
                    </button>
                  )}
                </div>

                {/* Existing Admin Response */}
                {review.adminResponse && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">{review.adminResponse.respondedBy}</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                          Admin
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-blue-600 ml-auto">
                        <Calendar className="w-3 h-3" />
                        <span>{review.adminResponse.respondedAt}</span>
                      </div>
                    </div>
                    <div className="ml-10">
                      <p className="text-blue-900">{review.adminResponse.content}</p>
                    </div>
                  </div>
                )}

                {/* Response Form */}
                {showResponseForm && !review.adminResponse && (
                  <form onSubmit={handleSubmitResponse} className="bg-blue-50 rounded-lg p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên người trả lời
                      </label>
                      <input
                        type="text"
                        value={responseForm.respondedBy}
                        onChange={(e) => setResponseForm(prev => ({ ...prev, respondedBy: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung phản hồi
                      </label>
                      <textarea
                        value={responseForm.content}
                        onChange={(e) => setResponseForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập phản hồi của admin..."
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={responseLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {responseLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResponseForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}

                {!review.adminResponse && !showResponseForm && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>Chưa có phản hồi từ admin</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Không tìm thấy đánh giá</p>
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

export default ReviewDetailModal;