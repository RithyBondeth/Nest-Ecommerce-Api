import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities /cart.entity';
import { CartItem } from 'src/entities /cartItem.entity';
import { Order, OrderStatus } from 'src/entities /order.entity';
import { OrderItem } from 'src/entities /orderItem.entity';
import { UserInfo } from 'src/user/decorators/user.decorator';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/order-create.dto';
import { GetOrderDto } from './dtos/order-get.dto';
import { OrderStatusDto } from './dtos/order-status.dto';
import { Product } from 'src/entities /product.entity';
import { OrderFilterDto } from './dtos/order-filter.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(Product) private producctRepo: Repository<Product>,
        @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>
    ){}

    async getAllOrder(filter: OrderFilterDto): Promise<GetOrderDto[]> {
        const orders = await this.orderRepo.find({
            relations: ["user"],
            where: { 
                ...(filter.status ? { status: filter.status } : {}),
                ...(filter.username ? { user: { username: filter.username }} : {})
            }
        })
        if(!orders) throw new NotFoundException("There's no order avaliable")

        return orders.map((order) => new GetOrderDto(order))
    }

    async getOrder(user: UserInfo): Promise<GetOrderDto> {
        const order = await this.orderRepo.findOne({ 
            relations: ["user"],
            where: { user: { id: user.sub } } 
        })   
        if(!order) throw new NotFoundException(`User with id ${user.sub} don't have an order`)

        return new GetOrderDto(order)
    }

    async getOrderById(orderId: number): Promise<GetOrderDto> {
        const order = await this.orderRepo.findOne({
            relations: ["user"],
            where: { id: orderId }
        })
        if(!order) throw new NotFoundException(`Order with id ${orderId} not found`)

        return new GetOrderDto(order)   
    }

    async createOrderFromCart(user: UserInfo): Promise<CreateOrderDto> {
        const existingOrder = await this.orderRepo.findOne({ where: { user: { id: user.sub } } })
        if(existingOrder) throw new NotFoundException(`User with id ${user.sub} already place an order`)

        const cart = await this.cartRepo.findOne({ 
            relations: ["cartItems", "cartItems.product", "user"],
            where: { user: { id: user.sub } } 
        })
        if(!cart || cart.cartItems.length === 0) throw new NotFoundException("Cart not found")

        const order = this.orderRepo.create({   
            user: cart.user,
            orderItems: [],
            status: OrderStatus.PENDING
        })

        for(const cartItem of cart.cartItems) {
            const orderItem = this.orderItemRepo.create({
                product: cartItem.product,
                quantity: cartItem.quantity,
                orderItemTotalPrice: cartItem.quantity  * cartItem.product.price 
            })

            order.orderItems.push(orderItem)
        }
        await this.orderRepo.save(order)

        //Clear cart after place order
        // Manually delete cart items first
        await this.cartItemRepo.delete({ cart: cart })        
        //Clear the cart after creating the order
        await this.cartRepo.delete({ user: { id: user.sub } })

        return new CreateOrderDto(order)
    }  

    async updateOrderStatus(orderId: number, body: OrderStatusDto): Promise<GetOrderDto> {
        const existingOrder = await this.orderRepo.findOne({
            relations: ["user", "orderItems", "orderItems.product"],
            where: { id: orderId }
        }) 
        if(!existingOrder) throw new NotFoundException(`Order with id ${orderId} not found`)
    
        if(body.status === OrderStatus.COMPLETED) {
            for(const order of existingOrder.orderItems) {
                const product = order.product
    
                //Calculate new stock
                const newStock = product.stock - order.quantity            
                if(newStock < 0) throw new NotFoundException(`Not enough stock for product ${product.name}`)
    
                //Update the product stock
                product.stock = newStock
                await this.producctRepo.save(product)
            }
        }

        await this.orderRepo.update(orderId, { status: body.status })

        const updatedOrder = await this.orderRepo.findOne({
            relations: ["user", "orderItems"],
            where: { id: orderId }
        })
    
        return new GetOrderDto(updatedOrder)
    }

    async deleteCancelledOrder(orderId: number) {
        const existingOrders = await this.orderRepo.find({ 
            relations: ["orderItems"],
            where: { id: orderId }
         })

        if(!existingOrders) throw new NotFoundException(`There no order with id ${orderId}`)

        await this.orderItemRepo.delete({ order: { id: orderId } })
        await this.orderRepo.delete({ id: orderId })
    
        return `Order with id ${orderId} deleted successfully`
    }
}