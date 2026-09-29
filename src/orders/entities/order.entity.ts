import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	cliente: string;
	@Column()
	item: string;
	@Column()
	cantidad: number;
}
