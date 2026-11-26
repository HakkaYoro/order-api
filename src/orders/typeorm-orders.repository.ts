import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderDelNegocio } from "./domain/entities/order.entity";
import { OrdersRepository } from "./domain/repositories/orders.repository";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrdersORM implements OrdersRepository {
	constructor(
		@InjectRepository(Order)
		private readonly repo: Repository<Order>,
	) {}

	async buscarPorId(id: number): Promise<OrderDelNegocio | null> {
		const fila = await this.repo.findOneBy({ id });
		if (fila === null) throw new Error("No existe esa ID! Baka!");
		return OrderDelNegocio.crear(fila.cantidad, fila.precio);
	}
	async buscarTodos(): Promise<OrderDelNegocio[]> {
		const filas = await this.repo.find();
		return filas.map((f) => OrderDelNegocio.crear(f.cantidad, f.precio));
	}
	async guardar(order: OrderDelNegocio): Promise<void> {
		const fila = new Order();
		fila.cantidad = order.cantidad.value;
		fila.precio = order.precioUnitarioCentavos;
		await this.repo.save(fila);
	}
	async eliminar(id: number): Promise<void> {
		await this.repo.delete(id);
	}
}
