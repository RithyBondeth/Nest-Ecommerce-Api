import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./orderItem.entity";

export enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, (user) => user.order)
    @JoinColumn({ name: "user_id" })
    user: User

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true, eager: true })   
    orderItems: OrderItem[]

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus

    @Column("decimal", { nullable: true })
    orderTotalPrice: number

    @BeforeInsert()
    @BeforeUpdate()
    calculateOrderTotalPrice() {
        this.orderTotalPrice = this.orderItems?.reduce((sum, item) => sum + item.orderItemTotalPrice, 0) || 0
    }

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}