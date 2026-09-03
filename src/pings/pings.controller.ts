import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { PingService } from "./pings.service";

@Controller("pings")
export class PingController {
	constructor(private readonly pingService: PingService) {}

	@Get()
	ping() {
		return this.pingService.ping();
	}
    @Get(':num')
    pingNum(@Param('num',ParseIntPipe) num:number){
        return this.pingService.pingNum(num);
    }
}
