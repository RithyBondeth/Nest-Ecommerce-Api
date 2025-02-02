import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities /product.entity';
import { ProductImage } from 'src/entities /productImage.entity';
import { Category } from 'src/entities /category.entity';
import { Brand } from 'src/entities / brand.entity';
import { User } from 'src/entities /user.entity';
import { JwtService } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, Category, Brand, User]), CategoryModule, BrandModule],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
