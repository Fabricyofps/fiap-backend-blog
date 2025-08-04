import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostRepository } from '../repositories/post.repository';
import { NotFoundException } from '@nestjs/common';
import { IPost } from '../schemas/models/post.interface';

describe('PostService', () => {
  let service: PostService;
  let repository: jest.Mocked<PostRepository>;

  const mockPost: IPost = {
    id: '507f1f77bcf86cd799439011',
    title: 'Test Post',
    content: 'Some content',
    author: 'Author',
  };

  const mockRepository = {
    getAllPost: jest.fn(),
    getPost: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    searchPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get(PostRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPost', () => {
    it('should return list of posts', async () => {
      repository.getAllPost.mockResolvedValue([mockPost]);

      const result = await service.getAllPost(10, 1);
      expect(result).toEqual([mockPost]);
      expect(repository.getAllPost).toHaveBeenCalledWith(10, 1);
    });
  });

  describe('getPost', () => {
    it('should return a post if found', async () => {
      repository.getPost.mockResolvedValue(mockPost);

      const result = await service.getPost(mockPost.id!);
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException for invalid ID format', async () => {
      await expect(service.getPost('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if post not found', async () => {
      repository.getPost.mockResolvedValue(null);

      await expect(service.getPost('507f1f77bcf86cd799439011')).rejects.toThrow('Post not found');
    });
  });

  describe('createPost', () => {
    it('should call createPost on repository', async () => {
      await service.createPost(mockPost);
      expect(repository.createPost).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('updatePost', () => {
    it('should update the post', async () => {
      repository.getPost.mockResolvedValue(mockPost);

      await service.updatePost(mockPost.id!, mockPost);
      expect(repository.updatePost).toHaveBeenCalledWith(mockPost.id, mockPost);
    });

    it('should throw NotFoundException for invalid ID', async () => {
      await expect(service.updatePost('invalid-id', mockPost)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      repository.getPost.mockResolvedValue(null);

      await expect(service.updatePost(mockPost.id!, mockPost)).rejects.toThrow('Post not found');
    });
  });

  describe('deletePost', () => {
    it('should delete the post', async () => {
      repository.getPost.mockResolvedValue(mockPost);

      await service.deletePost(mockPost.id!);
      expect(repository.deletePost).toHaveBeenCalledWith(mockPost.id);
    });

    it('should throw NotFoundException for invalid ID', async () => {
      await expect(service.deletePost('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if post not found', async () => {
      repository.getPost.mockResolvedValue(null);

      await expect(service.deletePost(mockPost.id!)).rejects.toThrow('Post not found');
    });
  });

  describe('searchPost', () => {
    it('should return search results', async () => {
      repository.searchPost.mockResolvedValue([mockPost]);

      const result = await service.searchPost('test', 10, 1);
      expect(result).toEqual([mockPost]);
      expect(repository.searchPost).toHaveBeenCalledWith('test', 10, 1);
    });

    it('should throw NotFoundException if no results', async () => {
      repository.searchPost.mockResolvedValue([]);

      await expect(service.searchPost('notfound', 10, 1)).rejects.toThrow('No posts found');
    });
  });
});
