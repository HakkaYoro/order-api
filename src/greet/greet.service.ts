import { Injectable } from "@nestjs/common";
import type { Saludo } from "./greet.interface";

@Injectable()
export class GreeterService implements Saludo {
	saludo(): string {
		return "Esta es una prueba! Saludos!";
	}
}
@Injectable()
export class GreeterService2 implements Saludo {
	saludo(): string {
		return "Saludo 2... Yuju?";
	}
}
