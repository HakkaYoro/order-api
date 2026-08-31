import { Injectable } from "@nestjs/common";

@Injectable()
export class PingService {
	private conteo = 1;
	private fecha: Date | null = null;
	ping() {
		const fecha = this.fecha
			? this.fecha.toLocaleString("es-ES", {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})
			: "Primer ping del día";
		this.fecha = new Date();
		return `Pong #${this.conteo++}!
		Último ping: ${fecha}!`;
	}
	pingNum(num: number) {
		return `Pong #${num}!`;
	}
}
