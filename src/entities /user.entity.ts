import { BeforeInsert, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Order } from "./order.entity";
import * as bcrypt from "bcrypt";

export enum UserRoles {
    ADMIN = "admin",
    USER = "user"   
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { unique: true })
    username: string

    @Column("varchar", { unique: true })
    email: string

    @Column('varchar')
    password: string

    @Column({ nullable: true })
    avatarUrl: string

    @Column({
        type: "enum",
        enum: UserRoles,
        default: UserRoles.USER
    })
    role: UserRoles

    @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
    cart: Cart

    @OneToOne(() => Order, (order) => order, { cascade: true })
    order: Order
  
    @BeforeInsert()
    async hashPassowrd() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}