import { Body, Controller, Param, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { updateUserSchema } from '../schemas/validations/user.validation';
import z from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

type UpdateUser = z.infer<typeof updateUserSchema>;

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  @ApiOperation({ summary: 'Atualiza os dados do usuário (exceto role)' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiBody({
    description: 'Dados para atualizar o usuário',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'teste@gmail.com' },
        password: { type: 'string', example: 'senha123456' },
        role: { type: 'string', example: 'aluno' },
      },
      required: ['email', 'password', 'role'],
    },
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado ou ID inválido' })
  @ApiResponse({ status: 400, description: 'Tentativa de alterar o role do usuário' })
  async updateUser(@Param('userId') userId: string, @Body() { email, password, role }: UpdateUser) {
    return this.userService.updateUser(userId, { email, password, role });
  }
}
