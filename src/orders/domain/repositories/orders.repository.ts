import type { OrderDelNegocio } from "../entities/order.entity";

export interface OrdersRepository {
	buscarPorId(id: number): Promise<OrderDelNegocio | null>;
	guardar(order: OrderDelNegocio): Promise<void>;
	buscarTodos(): Promise<OrderDelNegocio[]>;
	eliminar(id: number): Promise<void>;
}
