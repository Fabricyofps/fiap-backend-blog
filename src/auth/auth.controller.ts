import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/services/user.service';
import * as userInterface from 'src/users/schemas/models/user.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({
    description: 'Dados para cadastro do usuário',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@exemplo.com' },
        password: { type: 'string', example: 'minhasenha123' },
        role: {
          type: 'string',
          enum: ['aluno', 'professor'],
          example: 'aluno',
        },
      },
      required: ['email', 'password', 'role'],
    },
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() userData: userInterface.IUser) {
    return this.userService.createuser(userData);
  }

  @Post('login')
  @ApiOperation({ summary: 'Realiza login e retorna access_token' })
  @ApiBody({
    description: 'Credenciais do usuário',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@exemplo.com' },
        password: { type: 'string', example: 'minhasenha123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Login bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.authService.validateUser(credentials.email, credentials.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  async getProfile(@Req() req) {
    return this.userService.getUser(req.user.id);
  }
}
