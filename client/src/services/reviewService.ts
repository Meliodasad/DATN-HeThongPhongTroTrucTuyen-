import type { Review, ReviewReply, ReviewReplyFormData, ReviewFilters } from '../types/review';

class ReviewService {
private baseUrl = 'http://localhost:5000';

  async getReviews(filters?: ReviewFilters): Promise<Review[]> {
    try {
      // Get reviews with related data
      const reviewsResponse = await fetch(`${this.baseUrl}/reviews`);
      const reviews = await reviewsResponse.json();

      // Get rooms data
      const roomsResponse = await fetch(`${this.baseUrl}/rooms`);
      const rooms = await roomsResponse.json();

      // Get users data
      const usersResponse = await fetch(`${this.baseUrl}/users`);
      const users = await usersResponse.json();

      // Combine data
      const enrichedReviews = reviews.map((review: any) => {
        const room = rooms.find((r: any) => r.id === review.roomId);
        const tenant = users.find((u: any) => u.id === review.tenantId);
        const host = room ? users.find((u: any) => u.id === room.hostId) : null;

        return {
          ...review,
          status: review.status || 'approved', // Default status
          room: room ? {
            ...room,
            host: host || { fullName: 'Unknown', email: 'unknown@example.com' }
          } : {
            roomTitle: 'Unknown Room',
            location: 'Unknown',
            area: 0,
            price: 0,
            images: [],
            host: { fullName: 'Unknown', email: 'unknown@example.com' }
          },
          tenant: tenant || { fullName: 'Unknown', email: 'unknown@example.com' }
        };
      });

      // Apply filters
      let filteredReviews = enrichedReviews;

      if (filters?.status && filters.status !== 'all') {
        filteredReviews = filteredReviews.filter((review: Review) => review.status === filters.status);
      }

      if (filters?.rating) {
        filteredReviews = filteredReviews.filter((review: Review) => review.rating === filters.rating);
      }

      if (filters?.roomId) {
        filteredReviews = filteredReviews.filter((review: Review) => review.roomId === filters.roomId);
      }

      if (filters?.tenantId) {
        filteredReviews = filteredReviews.filter((review: Review) => review.tenantId === filters.tenantId);
      }

      return filteredReviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Không thể tải danh sách đánh giá');
    }
  }

  async getReviewById(id: string): Promise<Review> {
    try {
      const reviewResponse = await fetch(`${this.baseUrl}/reviews/${id}`);
      if (!reviewResponse.ok) {
        throw new Error('Review not found');
      }
      const review = await reviewResponse.json();

      // Get room data
      const roomResponse = await fetch(`${this.baseUrl}/rooms/${review.roomId}`);
      const room = await roomResponse.json();

      // Get tenant data
      const tenantResponse = await fetch(`${this.baseUrl}/users/${review.tenantId}`);
      const tenant = await tenantResponse.json();

      // Get host data
      const hostResponse = await fetch(`${this.baseUrl}/users/${room.hostId}`);
      const host = await hostResponse.json();

      return {
        ...review,
        status: review.status || 'approved',
        room: {
          ...room,
          host
        },
        tenant,
        replies: review.replies || []
      };
    } catch (error) {
      console.error('Error fetching review:', error);
      throw new Error('Không thể tải chi tiết đánh giá');
    }
  }

  async updateReviewStatus(id: string, status: Review['status']): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review status');
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      throw new Error('Không thể cập nhật trạng thái đánh giá');
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error('Không thể xóa đánh giá');
    }
  }

  async addReply(reviewId: string, replyData: ReviewReplyFormData): Promise<ReviewReply> {
    try {
      // Get current review
      const reviewResponse = await fetch(`${this.baseUrl}/reviews/${reviewId}`);
      const review = await reviewResponse.json();

      const newReply: ReviewReply = {
        id: Date.now().toString(),
        ...replyData,
        createdAt: new Date().toISOString()
      };

      const updatedReplies = [...(review.replies || []), newReply];

      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replies: updatedReplies }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      return newReply;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw new Error('Không thể thêm phản hồi');
    }
  }

  async deleteReply(reviewId: string, replyId: string): Promise<void> {
    try {
      // Get current review
      const reviewResponse = await fetch(`${this.baseUrl}/reviews/${reviewId}`);
      const review = await reviewResponse.json();

      const updatedReplies = (review.replies || []).filter((reply: ReviewReply) => reply.id !== replyId);

      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replies: updatedReplies }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete reply');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      throw new Error('Không thể xóa phản hồi');
    }
  }

  async getReviewStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    averageRating: number;
  }> {
    try {
      const reviews = await this.getReviews();
      
      const stats = {
        total: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        approved: reviews.filter(r => r.status === 'approved').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw new Error('Không thể tải thống kê đánh giá');
    }
  }
}

export const reviewService = new ReviewService();