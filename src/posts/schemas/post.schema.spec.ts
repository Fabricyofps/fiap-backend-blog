import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post, PostSchema } from './post.schema';

jest.setTimeout(15000);

describe('Post Schema', () => {
  let postModel: mongoose.Model<Post>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test-db-posts'),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
      ],
    }).compile();

    postModel = module.get<mongoose.Model<Post>>(getModelToken(Post.name));
    await mongoose.connection.asPromise();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await postModel.deleteMany({});
  });

  it('should create a post with title, content and author', async () => {
    const post = await postModel.create({
      title: 'Meu post de teste',
      content: 'Conteúdo do post',
      author: 'Fabricio',
    });

    expect(post).toHaveProperty('_id');
    expect(post.title).toBe('Meu post de teste');
    expect(post.content).toBe('Conteúdo do post');
    expect(post.author).toBe('Fabricio');
  });
});
