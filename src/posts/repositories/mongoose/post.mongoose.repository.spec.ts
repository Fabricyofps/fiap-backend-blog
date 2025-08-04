import { PostMongooseRepository } from './post.mongoose.repository';
import { Model } from 'mongoose';

describe('PostMongooseRepository', () => {
  let repository: PostMongooseRepository;
  let model: jest.Mocked<Model<any>>;

  const mockPost = {
    _id: 'postId123',
    title: 'Test Post',
    content: 'Content here',
    author: 'Author',
  };

  beforeEach(() => {
    model = {
      find: jest.fn(),
      findById: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      save: jest.fn(),
      skip: jest.fn(),
      limit: jest.fn(),
      exec: jest.fn(),
    } as any;

    repository = new PostMongooseRepository(model);
  });

  describe('getAllPost', () => {
    it('should return paginated posts', async () => {
      const execMock = jest.fn().mockResolvedValue([mockPost]);
      model.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({ exec: execMock }),
        }),
      } as any);

      const result = await repository.getAllPost(10, 1);

      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual([mockPost]);
    });
  });

  describe('getPost', () => {
    it('should return a post by id', async () => {
      const execMock = jest.fn().mockResolvedValue(mockPost);
      model.findById.mockReturnValue({ exec: execMock } as any);

      const result = await repository.getPost('postId123');

      expect(model.findById).toHaveBeenCalledWith({ _id: 'postId123' });
      expect(result).toEqual(mockPost);
    });
  });

  describe('createPost', () => {
    it('should create and save a post', async () => {
      const saveMock = jest.fn().mockResolvedValue(undefined);
      const newPostInstance = { save: saveMock };

      const modelConstructorMock = jest.fn().mockImplementation(() => newPostInstance);

      const repo = new PostMongooseRepository(modelConstructorMock as any);

      await repo.createPost(mockPost);

      expect(modelConstructorMock).toHaveBeenCalledWith(mockPost);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('updatePost', () => {
    it('should update a post by id', async () => {
      const execMock = jest.fn().mockResolvedValue(undefined);
      model.updateOne.mockReturnValue({ exec: execMock } as any);

      await repository.updatePost('postId123', mockPost);

      expect(model.updateOne).toHaveBeenCalledWith({ _id: 'postId123' }, { $set: mockPost });
    });
  });

  describe('deletePost', () => {
    it('should delete a post by id', async () => {
      const execMock = jest.fn().mockResolvedValue(undefined);
      model.deleteOne.mockReturnValue({ exec: execMock } as any);

      await repository.deletePost('postId123');

      expect(model.deleteOne).toHaveBeenCalledWith({ _id: 'postId123' });
    });
  });

  describe('searchPost', () => {
    it('should search posts by keyword with pagination', async () => {
      const execMock = jest.fn().mockResolvedValue([mockPost]);

      model.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({ exec: execMock }),
        }),
      } as any);

      const result = await repository.searchPost('test', 10, 1);

      expect(model.find).toHaveBeenCalledWith({
        $or: [{ title: { $regex: /test/i } }, { content: { $regex: /test/i } }],
      });
      expect(result).toEqual([mockPost]);
    });
  });
});
