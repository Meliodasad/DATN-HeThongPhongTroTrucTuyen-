import { apiService } from './api';
import type { Review, ReviewFormData, ReviewStats, AdminResponse } from '../types/review';

class ReviewService {
  // Get all reviews
  async getReviews(): Promise<Review[]> {
    return apiService.get<Review[]>('/reviews');
  }

  // Get review by ID
  async getReviewById(id: number): Promise<Review | null> {
    try {
      return await apiService.get<Review>(`/reviews/${id}`);
    } catch (error) {
        console.error(`Error fetching review with ID ${id}:`, error);
      return null;
    }
  }

  // Create new review
  async createReview(reviewData: ReviewFormData): Promise<Review> {
    const newReview = {
      ...reviewData,
      id: Date.now(),
      isVerified: false,
      helpfulCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'pending' as const
    };
    return apiService.post<Review>('/reviews', newReview);
  }

  // Update review
  async updateReview(id: number, reviewData: Partial<Review>): Promise<Review> {
    const updatedData = {
      ...reviewData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return apiService.patch<Review>(`/reviews/${id}`, updatedData);
  }

  // Delete review
  async deleteReview(id: number): Promise<void> {
    return apiService.delete<void>(`/reviews/${id}`);
  }

  // Update review status
  async updateReviewStatus(id: number, status: Review['status']): Promise<Review> {
    return apiService.patch<Review>(`/reviews/${id}`, { 
      status,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  }

  // Add admin response
  async addAdminResponse(id: number, response: AdminResponse): Promise<Review> {
    const adminResponse = {
      ...response,
      respondedAt: new Date().toISOString().split('T')[0]
    };
    return apiService.patch<Review>(`/reviews/${id}`, { 
      adminResponse,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  }

  // Update helpful count
  async updateHelpfulCount(id: number, increment: boolean = true): Promise<Review> {
    const review = await this.getReviewById(id);
    if (!review) throw new Error('Review not found');

    const newCount = increment ? review.helpfulCount + 1 : Math.max(0, review.helpfulCount - 1);
    return apiService.patch<Review>(`/reviews/${id}`, { 
      helpfulCount: newCount,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  }

  // Verify review
  async verifyReview(id: number, isVerified: boolean = true): Promise<Review> {
    return apiService.patch<Review>(`/reviews/${id}`, { 
      isVerified,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  }

  // Get review statistics
  async getReviewStats(): Promise<ReviewStats> {
    const reviews = await this.getReviews();
    
    const ratingDistribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length
    };

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    const recommendedCount = reviews.filter(r => r.isRecommended).length;
    const recommendationRate = reviews.length > 0 ? (recommendedCount / reviews.length) * 100 : 0;

    const stats: ReviewStats = {
      total: reviews.length,
      approved: reviews.filter(r => r.status === 'approved').length,
      pending: reviews.filter(r => r.status === 'pending').length,
      rejected: reviews.filter(r => r.status === 'rejected').length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      verifiedReviews: reviews.filter(r => r.isVerified).length,
      recommendationRate: Math.round(recommendationRate * 10) / 10
    };

    return stats;
  }

  // Get reviews by room
  async getReviewsByRoom(roomId: number): Promise<Review[]> {
    const reviews = await this.getReviews();
    return reviews.filter(r => r.roomId === roomId);
  }

  // Get reviews by user
  async getReviewsByUser(userId: number): Promise<Review[]> {
    const reviews = await this.getReviews();
    return reviews.filter(r => r.userId === userId);
  }
}

export const reviewService = new ReviewService();