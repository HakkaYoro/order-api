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
		expect(await service.findAll()).toHaveLength(0);
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
			cantidad: 6,
		});
		const pedido2 = await service.create({
			cliente: "Marisa Kirisame",
			item: "Grimorios de Patchy",
			cantidad: 5,
		});
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
		expect(async () => await service.findOne(67)).toThrow(NotFoundException);
	});
	it("update: cambia SOLO el campo enviado (cantidad) y conserva los otros (cliente, item intactos).", async () => {
		repo.save.mockResolvedValueOnce({
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
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
		expect(pedido1.cantidad).toBe(6);
		expect(await service.update(1, { cantidad: 5 })).toEqual({
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 5,
		});
	});
	it("update: id inexistente → lanza (misma familia del 404).", async () => {
		expect(async () => await service.update(1, { cantidad: 5 })).toThrow(
			NotFoundException,
		);
	});
	it("remove: el pedido deja de estar en findAll después de borrarlo.", async () => {
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
		expect(await service.remove(1)).toBeTruthy();
		expect(await service.findAll()).toHaveLength(0);
	});
	it("remove: id inexistente → lanza.", async () => {
		expect(async () => await service.remove(1)).toThrow(NotFoundException);
	});
});
