import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    name: string   

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}