import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { OrdersService } from "./orders.service";

describe("OrdersService", () => {
	let service: OrdersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [OrdersService],
		}).compile();

		service = module.get<OrdersService>(OrdersService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("create: el PRIMER pedido creado tiene id 1; el segundo tiene id 2.", () => {
		const pedido1 = service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 1,
		});
		const pedido2 = service.create({
			cliente: "Marisa Kirisame",
			item: "Grimorios de Patchy",
			cantidad: 5,
		});
		expect(pedido1.id).toBe(1);
		expect(pedido2.id).toBe(2);
	});
	it("create: devuelve el pedido creado CON sus campos (cliente, item, cantidad) y el id asignado por el server.", () => {
		const pedido1 = service.create({
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
	it("findAll: devuelve exactamente los pedidos creados (0 al inicio, 2 tras crear 2).", () => {
		expect(service.findAll()).toHaveLength(0);
		const pedido1 = service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
		const pedido2 = service.create({
			cliente: "Marisa Kirisame",
			item: "Grimorios de Patchy",
			cantidad: 5,
		});
		expect(service.findAll()).toHaveLength(2);
	});
	it("findOne: con un id existente → devuelve ese pedido.", () => {
		const pedido1 = service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
		expect(service.findOne(1)).toEqual({
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
	});
	// Leyendo docs resolví este.
	it("findOne: con un id que NO existe.", () => {
		expect(() => service.findOne(67)).toThrow(NotFoundException);
	});
	it("update: cambia SOLO el campo enviado (cantidad) y conserva los otros (cliente, item intactos).", () => {
		const pedido1 = service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
		expect(pedido1.cantidad).toBe(6);
		expect(service.update(1, { cantidad: 5 })).toEqual({
			id: 1,
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 5,
		});
	});
	it("update: id inexistente → lanza (misma familia del 404).", () => {
		expect(() => service.update(1, { cantidad: 5 })).toThrow(NotFoundException);
	});
	it("remove: el pedido deja de estar en findAll después de borrarlo.", () => {
		const pedido1 = service.create({
			cliente: "Reimu Hakurei",
			item: "Bolsa de Arroz",
			cantidad: 6,
		});
		expect(service.remove(1)).toBeTruthy();
		expect(service.findAll()).toHaveLength(0);
	});
	it("remove: id inexistente → lanza.", () => {
		expect(() => service.remove(1)).toThrow(NotFoundException);
	});
});
