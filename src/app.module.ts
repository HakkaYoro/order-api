import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { ApiGuard } from "./app.guard";
import { AppService } from "./app.service";
import { GreeterModule } from "./greet/greet.module";
import { OrdersModule } from "./orders/orders.module";
import { PingsModule } from "./pings/pings.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: "better-sqlite3",
			database: "order-data.sqlite",
			autoLoadEntities: true,
			synchronize: true,
		}),
		OrdersModule,
		PingsModule,
		GreeterModule,
	],
	controllers: [AppController],
	providers: [AppService, { provide: APP_GUARD, useClass: ApiGuard }],
})
export class AppModule {}
