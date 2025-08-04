import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna uma mensagem Hello World' })
  @ApiResponse({ status: 200, description: 'Mensagem retornada com sucesso' })
  getHello(): string {
    return this.appService.getHello();
  }
}
