import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OrdersModule } from "./orders/orders.module";
import { PingsModule } from "./pings/pings.module";

@Module({
	imports: [OrdersModule, PingsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
