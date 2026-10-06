import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Clientes } from "./entities/clientes.entity";
import { Order } from "./entities/order.entity";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
	imports: [TypeOrmModule.forFeature([Order, Clientes])],
	controllers: [OrdersController],
	providers: [OrdersService],
})
export class OrdersModule {}
