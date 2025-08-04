import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { PostService } from '../services/post.service';

import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import z from 'zod';
import { createPostSchema, updatePostSchema } from '../schemas/validations/post.validation';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/enums/user-role.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

type CreatePost = z.infer<typeof createPostSchema>;
type UpdatePost = z.infer<typeof updatePostSchema>;

@ApiTags('Posts')
@UseInterceptors(LoggingInterceptor)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOperation({ summary: 'Buscar posts por palavra-chave, seja no título ou conteúdo' })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Lista de posts encontrados' })
  async searchPost(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('q') query: string,
  ) {
    return this.postService.searchPost(query, limit, page);
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os posts com paginação' })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista paginada de posts' })
  async getAllPost(@Query('limit') limit: number, @Query('page') page: number) {
    return this.postService.getAllPost(limit, page);
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  @ApiOperation({ summary: 'Buscar um post por ID' })
  @ApiParam({ name: 'postId', type: String })
  @ApiResponse({ status: 200, description: 'Post encontrado' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  async getPost(@Param('postId') postId: string) {
    return this.postService.getPost(postId);
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Professor)
  @Post()
  @UsePipes(new ZodValidationPipe(createPostSchema))
  @ApiOperation({ summary: 'Criar novo post' })
  @ApiBody({
    description: 'Dados para criação do post',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Meu Post' },
        content: { type: 'string', example: 'Conteúdo do post' },
        author: { type: 'string', example: 'John Doe' },
      },
      required: ['title', 'content', 'author'],
    },
  })
  @ApiResponse({ status: 201, description: 'Post criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Você não tem autorização para acessar este recurso' })
  async createPost(@Body() { title, content, author }: CreatePost) {
    return this.postService.createPost({ title, content, author });
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Professor)
  @Put(':postId')
  @ApiOperation({ summary: 'Atualizar um post existente' })
  @ApiParam({ name: 'postId', type: String })
  @ApiBody({
    description: 'Dados para atualização do post',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Título atualizado' },
        content: { type: 'string', example: 'Conteúdo atualizado' },
        author: { type: 'string', example: 'John Doe' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Post atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  async updatePost(
    @Param('postId') postId: string,
    @Body(new ZodValidationPipe(updatePostSchema)) post: UpdatePost,
  ) {
    return this.postService.updatePost(postId, post);
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Professor)
  @Delete(':postId')
  @ApiOperation({ summary: 'Remover um post (somente professores)' })
  @ApiParam({ name: 'postId', type: String })
  @ApiResponse({ status: 200, description: 'Post removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  async deletePost(@Param('postId') postId: string) {
    return this.postService.deletePost(postId);
  }
}
