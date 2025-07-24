import { apiService } from './api';
import type { Comment, CommentFormData, CommentStats, CommentReply, CommentReplyFormData } from '../types/comment';

class CommentService {
  // Get all comments
  async getComments(): Promise<Comment[]> {
    return apiService.get<Comment[]>('/comments');
  }

  // Get comment by ID
  async getCommentById(id: number): Promise<Comment | null> {
    try {
      return await apiService.get<Comment>(`/comments/${id}`);
    } catch (error) {
      return null;
    }
  }

  // Create new comment
  async createComment(commentData: CommentFormData): Promise<Comment> {
    const newComment = {
      ...commentData,
      id: Date.now(), // Temporary ID generation
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      replies: []
    };
    return apiService.post<Comment>('/comments', newComment);
  }

  // Update comment
  async updateComment(id: number, commentData: Partial<Comment>): Promise<Comment> {
    return apiService.patch<Comment>(`/comments/${id}`, commentData);
  }

  // Delete comment
  async deleteComment(id: number): Promise<void> {
    return apiService.delete<void>(`/comments/${id}`);
  }

  // Update comment status
  async updateCommentStatus(id: number, status: Comment['status']): Promise<Comment> {
    return apiService.patch<Comment>(`/comments/${id}`, { status });
  }

  // Add reply to comment
  async addReply(commentId: number, replyData: CommentReplyFormData): Promise<Comment> {
    const comment = await this.getCommentById(commentId);
    if (!comment) throw new Error('Comment not found');

    const newReply: CommentReply = {
      id: Date.now(),
      ...replyData,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedReplies = [...(comment.replies || []), newReply];
    return apiService.patch<Comment>(`/comments/${commentId}`, { replies: updatedReplies });
  }

  // Delete reply from comment
  async deleteReply(commentId: number, replyId: number): Promise<Comment> {
    const comment = await this.getCommentById(commentId);
    if (!comment) throw new Error('Comment not found');

    const updatedReplies = (comment.replies || []).filter(reply => reply.id !== replyId);
    return apiService.patch<Comment>(`/comments/${commentId}`, { replies: updatedReplies });
  }

  // Get comment statistics
  async getCommentStats(): Promise<CommentStats> {
    const comments = await this.getComments();
    
    const ratingsWithValues = comments.filter(c => c.rating && c.rating > 0);
    const averageRating = ratingsWithValues.length > 0 
      ? ratingsWithValues.reduce((sum, c) => sum + (c.rating || 0), 0) / ratingsWithValues.length 
      : 0;

    const stats: CommentStats = {
      total: comments.length,
      approved: comments.filter(c => c.status === 'approved').length,
      pending: comments.filter(c => c.status === 'pending').length,
      rejected: comments.filter(c => c.status === 'rejected').length,
      averageRating: Math.round(averageRating * 10) / 10
    };

    return stats;
  }
}

export const commentService = new CommentService();