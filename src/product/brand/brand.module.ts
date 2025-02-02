import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/entities / brand.entity';
import { Product } from 'src/entities /product.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities /user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Product, User])],
  controllers: [BrandController],
  providers: [BrandService, JwtService],
})
export class BrandModule {}
