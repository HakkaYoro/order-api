import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class Clientes {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	nomCompleto: string;
	@OneToMany(
		() => Order,
		(order) => order.cliente,
	)
	orders: Order[];
}
