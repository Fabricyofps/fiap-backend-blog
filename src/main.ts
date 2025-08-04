import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Blog Backend')
    .setDescription('The blog API for Tech Challenge')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Informe o token JWT',
        in: 'header',
      },
      'jwt-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: (a: string, b: string) => {
        const order = ['Auth', 'Users', 'Posts', 'Prometheus'];
        return order.indexOf(a) - order.indexOf(b);
      },
    },
  });

  await app.listen(Number(process.env.PORT) ?? 3000);
}
bootstrap();
