import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/env';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(env.BLOG_MONGO_URI!),
    PostsModule,
    JwtModule.register({
      global: true,
      secret: process.env.BLOG_JWT_SECRET,
      signOptions: {
        expiresIn: '10m',
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
