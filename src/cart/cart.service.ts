import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities /cart.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/entities /product.entity';
import { CartItem } from 'src/entities /cartItem.entity';
import { UserInfo } from 'src/user/decorators/user.decorator';
import { CreateCartDto } from './dtos/cart-create.dto';
import { GetCartDTO } from './dtos/cart-get.dto';
import { AddItemToCartDto } from './dtos/cart-additem.dto';
import { UpdateCartItemDto } from './dtos/cart-updateitem.dto';
import { GetAllCartDTO } from './dtos/cart-getall.dto';

@Injectable()
export class CartService {
    constructor( 
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
        @InjectRepository(Product) private productRepo: Repository<Product>
    ){}

    async getAllCart(): Promise<GetAllCartDTO[]> {
        const carts = await this.cartRepo.find({
            relations: ["cartItems", "cartItems.product", "user"]
        })
        return carts.map((cart) => new GetAllCartDTO(cart))
    }

    async getCart(userId: number): Promise<GetCartDTO> {
        const existingCart = await this.cartRepo.findOne({ 
            relations: ["cartItems", "cartItems.product", "user"],
            where: { user: { id: userId } }
        })
        if(!existingCart) throw new NotFoundException(`User with id ${userId} don't have a cart`) 

        return new GetCartDTO(existingCart)
    }

    async createCart(user: UserInfo): Promise<CreateCartDto> {
        const existingCart = await this.cartRepo.findOne({ where: { user: { id: user.sub } } })
        if(existingCart) throw new NotFoundException(`User with id ${user.sub} already have cart`)

        const newCart = this.cartRepo.create({ user: { id: user.sub, username: user.username } })
        await this.cartRepo.save(newCart)

        return new CreateCartDto(newCart)
    }

    async addItemToCart(user: UserInfo, body: AddItemToCartDto): Promise<GetCartDTO> {
        const cartToAdd = await this.getCart(user.sub)
        const productToAdd = await this.productRepo.findOne({ where: { id: body.productId } })
        if(!productToAdd) throw new NotFoundException(`There's no product with id ${body.productId}`)

        let cartItem = cartToAdd.cartItems.find((item) => item.product.id === body.productId)

        if(cartItem) {
            //Update existing cartItem  quantity 
            cartItem.quantity += body.quantity
            await this.cartItemRepo.save(cartItem)
        } else {
            //Create new cartItem
            cartItem = this.cartItemRepo.create({
                product: productToAdd,
                quantity: body.quantity,
            })
            cartToAdd.cartItems.push(cartItem)
            await this.cartItemRepo.save(cartItem)
        }
        await this.cartRepo.save(cartToAdd)

        return new GetCartDTO(cartToAdd)
    }

    async updateCartItem(user: UserInfo, cartItemId: number, body: UpdateCartItemDto): Promise<GetCartDTO> {
        const cartToUpdate = await this.getCart(user.sub)
        const cartItemToUpdate = cartToUpdate.cartItems.find((item) => item.id === cartItemId)

        if(!cartItemToUpdate) throw new NotFoundException(`CartItem with id ${cartItemId} not found`)

        cartItemToUpdate.quantity = body.quantity  
        await this.cartItemRepo.save(cartItemToUpdate)

        await this.cartRepo.save(cartToUpdate)
    
        return new GetCartDTO(cartToUpdate)
    }

    async removeItemFromCart(user: UserInfo, cartItemId: number) {
        const cart = await this.getCart(user.sub)
        const cartItemToRemoveIndex = cart.cartItems.findIndex((item) => item.id === cartItemId)

        if(cartItemToRemoveIndex === -1) throw new NotFoundException(`CartItem with id ${cartItemId} not found`)

        await this.cartItemRepo.delete(cart.cartItems[cartItemToRemoveIndex].id)
        cart.cartItems.splice(cartItemToRemoveIndex, 1)

        await this.cartRepo.save(cart)
        
        return `Remove CartItem with id ${cartItemId} successfully`
    }
}  
