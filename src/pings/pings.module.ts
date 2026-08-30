import { Module } from "@nestjs/common";
import { PingController } from "./pings.controller";
import { PingService } from "./pings.service";

@Module({
	controllers: [PingController],
	providers: [PingService],
})
export class PingsModule {}
