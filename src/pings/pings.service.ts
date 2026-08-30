import { Injectable } from "@nestjs/common";

@Injectable()
export class PingService {
	ping() {
		return "Pong!";
	}
	pingNum(num: number) {
		return `Pong #${num}!`;
	}
}
