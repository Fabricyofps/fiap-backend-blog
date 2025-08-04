import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { IPost } from '../schemas/models/post.interface';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getAllPost(limit: number, page: number) {
    return this.postRepository.getAllPost(limit, page);
  }

  async getPost(postId: string) {
    if (!isValidObjectId(postId)) {
      throw new NotFoundException('Invalid post ID');
    }
    const post = await this.postRepository.getPost(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async createPost(post: IPost) {
    return this.postRepository.createPost(post);
  }

  async updatePost(postId: string, post: IPost) {
    if (!isValidObjectId(postId)) {
      throw new NotFoundException('Invalid post ID');
    }

    const findPost = await this.postRepository.getPost(postId);

    if (!findPost) {
      throw new NotFoundException('Post not found');
    }

    return this.postRepository.updatePost(postId, post);
  }

  async deletePost(postId: string) {
    if (!isValidObjectId(postId)) {
      throw new NotFoundException('Invalid post ID');
    }

    const findPost = await this.postRepository.getPost(postId);

    if (!findPost) {
      throw new NotFoundException('Post not found');
    }

    return this.postRepository.deletePost(postId);
  }

  async searchPost(keyword: string, limit: number, page: number) {
    const post = await this.postRepository.searchPost(keyword, limit, page);

    if (!post || post.length === 0) {
      throw new NotFoundException('No posts found');
    }
    return post;
  }
}
