import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrdersService {
	constructor(
		@InjectRepository(Order)
		private readonly ordersRepository: Repository<Order>,
	) {}
	async create(createOrderDto: CreateOrderDto): Promise<Order> {
		const newItem = new Order();
		newItem.cliente = createOrderDto.cliente;
		newItem.item = createOrderDto.item;
		newItem.cantidad = createOrderDto.cantidad;
		return await this.ordersRepository.save(newItem);
	}

	async findAll(): Promise<Order[]> {
		return this.ordersRepository.find();
	}

	async findOne(id: number): Promise<Order> {
		const item = await this.ordersRepository.findOneBy({ id });
		if (!item) {
			throw new NotFoundException(`No existe el item con ID ${id}... Baka!`);
		}
		return item;
	}

	async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
		const item = await this.ordersRepository.findOneBy({ id });
		if (!item) {
			throw new NotFoundException(`No existe el item con ID ${id}... Baka!`);
		}
		Object.assign(item, updateOrderDto);
		return this.ordersRepository.save(item);
	}

	async remove(id: number): Promise<{ message: string }> {
		const item = await this.findOne(id);
		await this.ordersRepository.remove(item);
		return { message: `Eliminado satisfactoriamente el item con ID ${id}!` };
	}
}
