import { Controller, Get, Inject } from "@nestjs/common";
import type { Saludo } from "./greet.interface";

@Controller("greet")
export class GreeterController {
	constructor(@Inject('Saludo') private readonly saludo: Saludo) {}
	@Get()
	greet() {
		return this.saludo.saludo();
	}
}
