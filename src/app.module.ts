import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { ApiGuard } from "./app.guard";
import { AppService } from "./app.service";
import { GreeterModule } from "./greet/greet.module";
import { OrdersModule } from "./orders/orders.module";
import { PingsModule } from "./pings/pings.module";

@Module({
	imports: [OrdersModule, PingsModule, GreeterModule],
	controllers: [AppController],
	providers: [AppService, { provide: APP_GUARD, useClass: ApiGuard }],
})
export class AppModule {}
