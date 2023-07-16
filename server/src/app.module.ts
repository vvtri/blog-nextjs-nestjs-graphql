import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  Module,
  ValidationPipe,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { dataSource } from '../data-source';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import appConfig from './common/configs/app.config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { APP_PIPE, ModuleRef } from '@nestjs/core';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { DataLoaderModule } from './data-loader/data-loader.module';
import { DataLoaderService } from './data-loader/services/data-loader.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataLoaderModule],
      inject: [DataLoaderService],
      useFactory: async (dataLoaderService: DataLoaderService) => {
        return {
          autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context: { loaders: dataLoaderService.getLoaders() },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({} as any),
      dataSourceFactory: async () => {
        initializeTransactionalContext();
        return addTransactionalDataSource(dataSource);
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => appConfig],
      cache: true,
    }),
    JwtModule.register({ global: true }),

    AuthModule,
    PostModule,
    CommentModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { exposeDefaultValues: true },
      }),
    },
    AppService,
    AppResolver,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress({ maxFileSize: 5242880, maxFiles: 10 }))
      .forRoutes('*');
  }
}
