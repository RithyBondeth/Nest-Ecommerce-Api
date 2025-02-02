import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities /cart.entity';
import { Order } from 'src/entities /order.entity';
import { OrderItem } from 'src/entities /orderItem.entity';
import { CartItem } from 'src/entities /cartItem.entity';
import { User } from 'src/entities /user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Product } from 'src/entities /product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Order, OrderItem, User, Product]), JwtModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
