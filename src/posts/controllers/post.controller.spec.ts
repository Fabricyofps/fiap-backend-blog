import { PostController } from './post.controller';
import { PostService } from '../services/post.service';

describe('PostController', () => {
  let controller: PostController;
  let service: Partial<Record<keyof PostService, jest.Mock>>;

  beforeEach(() => {
    service = {
      searchPost: jest.fn(),
      getAllPost: jest.fn(),
      getPost: jest.fn(),
      createPost: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
    };

    controller = new PostController(service as unknown as PostService);
  });

  describe('searchPost', () => {
    it('should call service.searchPost with correct params', async () => {
      const limit = 10;
      const page = 1;
      const q = 'keyword';

      service.searchPost!.mockResolvedValue(['post1', 'post2']);

      const result = await controller.searchPost(limit, page, q);

      expect(service.searchPost).toHaveBeenCalledWith(q, limit, page);
      expect(result).toEqual(['post1', 'post2']);
    });
  });

  describe('getAllPost', () => {
    it('should call service.getAllPost with correct params', async () => {
      const limit = 5;
      const page = 2;

      service.getAllPost!.mockResolvedValue(['postA', 'postB']);

      const result = await controller.getAllPost(limit, page);

      expect(service.getAllPost).toHaveBeenCalledWith(limit, page);
      expect(result).toEqual(['postA', 'postB']);
    });
  });

  describe('getPost', () => {
    it('should call service.getPost with correct postId', async () => {
      const postId = 'post123';

      service.getPost!.mockResolvedValue({ title: 'Post title' });

      const result = await controller.getPost(postId);

      expect(service.getPost).toHaveBeenCalledWith(postId);
      expect(result).toEqual({ title: 'Post title' });
    });
  });

  describe('createPost', () => {
    it('should call service.createPost with correct data', async () => {
      const dto = {
        title: 'New Post',
        content: 'Content here',
        author: 'Author name',
      };

      service.createPost!.mockResolvedValue(undefined);

      const result = await controller.createPost(dto);

      expect(service.createPost).toHaveBeenCalledWith(dto);
      expect(result).toBeUndefined();
    });
  });

  describe('updatePost', () => {
    it('should call service.updatePost with correct postId and data', async () => {
      const postId = 'post123';
      const dto = {
        title: 'Updated title',
        content: 'Updated content',
        author: 'Author name',
      };

      service.updatePost!.mockResolvedValue(undefined);

      const result = await controller.updatePost(postId, dto);

      expect(service.updatePost).toHaveBeenCalledWith(postId, dto);
      expect(result).toBeUndefined();
    });
  });

  describe('deletePost', () => {
    it('should call service.deletePost with correct postId', async () => {
      const postId = 'post123';

      service.deletePost!.mockResolvedValue(undefined);

      const result = await controller.deletePost(postId);

      expect(service.deletePost).toHaveBeenCalledWith(postId);
      expect(result).toBeUndefined();
    });
  });
});
