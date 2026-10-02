import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Order } from "./entities/order.entity";
import { OrdersService } from "./orders.service";

describe("OrdersService", () => {
	let service: OrdersService;
	let repo: { find: any; findOneBy: any; save: any; create: any; remove: any };

	beforeEach(async () => {
		repo = {
			find: vi.fn(),
			findOneBy: vi.fn(),
			save: vi.fn(),
			create: vi.fn(),
			remove: vi.fn(),
		};
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OrdersService,
				{ provide: getRepositoryToken(Order), useValue: repo },
			],
		}).compile();
		service = module.get<OrdersService>(OrdersService);
	});

	it("should be defined", async () => {
		expect(await service).toBeDefined();
	});

	it("create: el PRIMER pedido creado tiene id 1; el segundo tiene id 2.", async () => {
		repo.save
			.mockResolvedValueOnce({
				id: 1,
				cliente: "Reimu Hakurei",
				item: "Bolsa de Arroz",
				cantidad: 1,
			})
			.mockResolvedValueOnce({
				id: 2,
				cliente: "Marisa Kirisame",
				item: "Grimorios de Patchy",
				cantidad: 5,
			});

		const pedido1 = await service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 1,
		});
		const pedido2 = await service.create({
			cliente: "Marisa Kirisame",
			item: "Grimorios de Patchy",
			cantidad: 5,
		});
		expect(pedido1.id).toBe(1);
		expect(pedido2.id).toBe(2);
	});
	it("create: devuelve el pedido creado CON sus campos (cliente, item, cantidad) y el id asignado por el server.", async () => {
		repo.save
			.mockResolvedValueOnce({
				id: 1,
				cliente: "Reimu Hakurei",
				item: "Bolsa de Arroz",
				cantidad: 1,
			})
			.mockResolvedValueOnce({
				id: 2,
				cliente: "Marisa Kirisame",
				item: "Grimorios de Patchy",
				cantidad: 5,
			});
		const pedido1 = await service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 1,
		});
		expect(pedido1).toEqual({
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 1,
		});
	});
	it("findAll: devuelve exactamente los pedidos creados (0 al inicio, 2 tras crear 2).", async () => {
		repo.find.mockResolvedValueOnce([]);
		expect(await service.findAll()).toHaveLength(0);
		repo.save
			.mockResolvedValueOnce({
				id: 1,
				cliente: "Reimu Hakurei",
				item: "Bolsa de Arroz",
				cantidad: 6,
			})
			.mockResolvedValueOnce({
				id: 2,
				cliente: "Marisa Kirisame",
				item: "Grimorios de Patchy",
				cantidad: 5,
			});
		const pedido1 = await service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
		const pedido2 = await service.create({
			cliente: "Marisa Kirisame",
			item: "Grimorios de Patchy",
			cantidad: 5,
		});

		repo.find.mockResolvedValueOnce([pedido1, pedido2]);
		expect(await service.findAll()).toHaveLength(2);
	});
	it("findOne: con un id existente → devuelve ese pedido.", async () => {
		repo.findOneBy.mockResolvedValueOnce({
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});

		const pedido1 = await service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
		expect(await service.findOne(1)).toEqual({
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
	});
	// Leyendo docs resolví este.
	it("findOne: con un id que NO existe.", async () => {
		repo.findOneBy.mockResolvedValueOnce(undefined);

		await expect(service.findOne(67)).rejects.toThrow(
			new NotFoundException(`No existe el item con ID 67... Baka!`),
		);
	});
	it("update: cambia SOLO el campo enviado (cantidad) y conserva los otros (cliente, item intactos).", async () => {
		const pedido = {
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		};
		repo.findOneBy.mockResolvedValueOnce(pedido);
		repo.save.mockResolvedValueOnce({ ...pedido, cantidad: 5 });

		expect(await service.update(1, { cantidad: 5 })).toEqual({
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 5,
		});
	});
	it("update: id inexistente → lanza (misma familia del 404).", async () => {
		repo.findOneBy.mockResolvedValueOnce(undefined);
		await expect(service.update(1, { cantidad: 5 })).rejects.toThrow(
			new NotFoundException(`No existe el item con ID 1... Baka!`),
		);
	});
	it("remove: el pedido deja de estar en findAll después de borrarlo.", async () => {
		const pedido = {
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		};

		const pedidos = [pedido];

		repo.findOneBy.mockImplementation(async ({ id }: { id: number }) =>
			pedidos.find((pedido) => pedido.id === id),
		);
		repo.find.mockImplementation(async () => pedidos);
		repo.remove.mockImplementation(async (pedido: (typeof pedidos)[number]) => {
			const index = pedidos.indexOf(pedido);
			pedidos.splice(index, 1);
			return pedido;
		});

		await expect(service.remove(1)).resolves.toEqual({
			message: "Eliminado satisfactoriamente el item con ID 1!",
		});

		expect(repo.remove).toHaveBeenCalledWith(pedido);
		await expect(service.findAll()).resolves.toEqual([]);
	});
	it("remove: id inexistente → lanza.", async () => {
		repo.findOneBy.mockResolvedValueOnce(undefined);
		await expect(service.remove(1)).rejects.toThrow(
			new NotFoundException(`No existe el item con ID 1... Baka!`),
		);
	});
});
