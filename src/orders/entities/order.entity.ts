import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Clientes } from "./clientes.entity";

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number;
	@ManyToOne(
		() => Clientes,
		(cliente) => cliente.orders,
	)
	cliente: Clientes;
	@Column()
	item: string;
	@Column()
	cantidad: number;
}
