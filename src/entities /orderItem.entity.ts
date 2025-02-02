import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column("int")
    quantity: number
    
    @ManyToOne(() => Product, (product) => product.orderItems)
    @JoinColumn({ name: "product_id" })
    product: Product

    @ManyToOne(() => Order, (order) => order)
    @JoinColumn({ name: "order_id" })
    order: Order
    
    @Column("decimal", { nullable: true }) 
    orderItemTotalPrice: number

    @BeforeInsert()
    @BeforeUpdate()
    calculateOrderItemTotalPrice() {
        if(this.product) {
            this.orderItemTotalPrice = this.quantity * this.product.price
        } else {
            this.orderItemTotalPrice = 0
        }
    }

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}