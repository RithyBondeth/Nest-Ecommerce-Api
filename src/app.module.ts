import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { dbConfig } from './config/db.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    //Load enviroment variables globally
    ConfigModule.forRoot({ isGlobal: true }),
    //Database configuration 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dbConfig
    }),
    UserModule,
    ProductModule,
    AuthModule,
    CartModule,
    OrderModule
  ],
  controllers: [],
  providers: [, 
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor
    }
  ],
})
export class AppModule {}
