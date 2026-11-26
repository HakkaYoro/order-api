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
	// Decisión: nullable y no default 0; de las 212 filas viejas no sé cuánto pagaron, y un 0 diría que pagaron 0.
	@Column({ nullable: true })
	precio: number;
}
