import { IPost } from '../schemas/models/post.interface';

export abstract class PostRepository {
  abstract getAllPost(limit: number, page: number): Promise<IPost[]>;
  abstract getPost(postId: string): Promise<IPost | null>;
  abstract createPost(post: IPost): Promise<void>;
  abstract updatePost(postId: string, post: IPost): Promise<void>;
  abstract deletePost(postId: string): Promise<void>;
  abstract searchPost(keyword: string, limit: number, page: number): Promise<IPost[]>;
}
