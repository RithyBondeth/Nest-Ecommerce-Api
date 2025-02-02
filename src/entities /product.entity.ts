import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { ProductImage } from "./productImage.entity";
import { Category } from "./category.entity";
import { CartItem } from "./cartItem.entity";
import { OrderItem } from "./orderItem.entity";
import { Brand } from "./ brand.entity";

@Entity()
@Unique(["name"])
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    name: string
 
    @Column("text") 
    description: string

    @Column("decimal")
    price: number

    @Column("int")
    stock: number

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "category_id" })
    category: Category

    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn({ name: "brand_id" })
    brand: Brand

    @OneToMany(() => ProductImage, (productImage) => productImage.product, { cascade: true })
    images: ProductImage[]

    @OneToMany(() => CartItem, (cartItem) => cartItem.product, { cascade: true })
    cartItems: CartItem[]   

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product, { cascade: true })
    orderItems: OrderItem[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}  