import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities /cart.entity';
import { CartItem } from 'src/entities /cartItem.entity';
import { Product } from 'src/entities /product.entity';
import { User } from 'src/entities /user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, User])],
  controllers: [CartController],
  providers: [CartService, JwtService]
})
export class CartModule {}
