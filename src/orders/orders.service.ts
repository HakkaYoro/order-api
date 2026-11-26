import { Inject, Injectable, NotFoundException, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderDelNegocio } from "./domain/entities/order.entity";
import type { OrdersRepository } from "./domain/repositories/orders.repository";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Clientes } from "./entities/clientes.entity";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrdersService {
	constructor(
		@Inject("OrdersRepository")
		private readonly ordersRepository: OrdersRepository,

		@InjectRepository(Clientes)
		private readonly clientesRepository: Repository<Clientes>,
	) {}
	async create(createOrderDto: CreateOrderDto): Promise<void> {
		if (createOrderDto.cliente.id) {
			const clienteExistente = await this.clientesRepository.findOneBy({
				id: createOrderDto.cliente.id,
			});
			if (!clienteExistente) {
				throw new NotFoundException(
					`No existe el cliente con ID ${createOrderDto.cliente.id}`,
				);
			}
		} else {
			const nuevoCliente = new Clientes();
			nuevoCliente.nomCompleto = createOrderDto.cliente.nomCompleto;
			await this.clientesRepository.save(nuevoCliente);
		}
		const order = OrderDelNegocio.crear(
			createOrderDto.cantidad,
			createOrderDto.precioUnitarioCentavos,
		);
		// Decisión: precio en DTO porque aún no hay catálogo; no invento un default.
		// Al añadir catálogo, resolverlo server-side.
		// Decisión: create devuelve void porque guardar también; devolver Order requiere id en el dominio (C.3).
		await this.ordersRepository.guardar(order);
	}

	async findAll(): Promise<OrderDelNegocio[]> {
		return this.ordersRepository.buscarTodos();
	}

	async findOne(id: number): Promise<OrderDelNegocio> {
		const item = await this.ordersRepository.buscarPorId(id);
		if (!item) {
			throw new NotFoundException(`No existe el item con ID ${id}... Baka!`);
		}
		return item;
	}

	async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
		// Decisión: lanza 501 porque hoy no se puede hacer bien; Object.assign mete un número suelto donde va un CantidadDelNegocio, y guardar solo inserta (new Order), nunca actualiza.
		throw new NotImplementedException();
	}

	async remove(id: number): Promise<{ message: string }> {
		await this.findOne(id);
		await this.ordersRepository.eliminar(id);
		return { message: `Eliminado satisfactoriamente el item con ID ${id}!` };
	}
}
