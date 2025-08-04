import { IPost } from 'src/posts/schemas/models/post.interface';
import { PostRepository } from '../post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/posts/schemas/post.schema';
import { Model } from 'mongoose';

export class PostMongooseRepository implements PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  getAllPost(limit: number, page: number): Promise<IPost[]> {
    const offset = (page - 1) * limit;
    return this.postModel.find().skip(offset).limit(limit).exec();
  }

  getPost(postId: string): Promise<IPost | null> {
    return this.postModel.findById({ _id: postId }).exec();
  }

  async createPost(post: IPost): Promise<void> {
    const createPost = new this.postModel(post);
    await createPost.save();
  }

  async updatePost(postId: string, post: IPost): Promise<void> {
    await this.postModel.updateOne({ _id: postId }, { $set: post }).exec();
  }

  async deletePost(postId: string): Promise<void> {
    await this.postModel.deleteOne({ _id: postId }).exec();
  }

  searchPost(keyword: string, limit: number, page: number): Promise<IPost[]> {
    const offset = (page - 1) * limit;
    const regex = new RegExp(keyword, 'i');

    return this.postModel
      .find({
        $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
      })
      .skip(offset)
      .limit(limit)
      .exec();
  }
}
