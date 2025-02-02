import { Column, CreateDateColumn, Entity, JoinColumn,  ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column("int")
    quantity: number

    @ManyToOne(() => Product, (product) => product.cartItems)
    @JoinColumn({ name: "product_id" })
    product: Product

    @ManyToOne(()=> Cart, (cart) => cart.cartItems)
    @JoinColumn({ name: "cart_id" })
    cart: Cart

    //Getter to calculate itemTotalPrice dynamically
    get cartItemTotalPrice(): number {
        return this.quantity * (this.product?.price || 0)
    }

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}