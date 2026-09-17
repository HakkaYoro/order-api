import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrdersService {
	private inventory: Order[] = [];
	private nxId = 1;
	create(createOrderDto: CreateOrderDto): Order {
		const newItem = new Order();
		newItem.id = this.nxId++;
		newItem.cliente = createOrderDto.cliente;
		newItem.item = createOrderDto.item;
		newItem.cantidad = createOrderDto.cantidad;
		this.inventory.push(newItem);
		return newItem;
	}

	findAll(): Order[] {
		return this.inventory;
	}

	findOne(id: number): Order {
		const item = this.inventory.find((item) => item.id === id);
		if (!item) {
			throw new NotFoundException(`No existe el item con ID ${id}... Baka!`);
		}
		return item;
	}

	update(id: number, updateOrderDto: UpdateOrderDto): Order {
		const item = this.inventory.find((itemId) => itemId.id === id);
		if (!item) {
			throw new NotFoundException(`No existe el item con ID ${id}... Baka!`);
		}
		Object.assign(item, updateOrderDto);
		return item;
	}

	remove(id: number): { message: string } {
		const item = this.inventory.findIndex((itemId) => itemId.id === id);
		if (item === -1) {
			throw new NotFoundException(`No existe el item con ID ${id}... Baka!`);
		}
		this.inventory.splice(item, 1);
		return { message: `Eliminado satisfactoriamente el item con ID ${id}!` };
	}
}
