import { Module } from "@nestjs/common";
import { GreeterController } from "./greet.controller";
import { GreeterService, GreeterService2 } from "./greet.service";
// No se toca controller porque en greeter hice una especie de generic para que pudiera usar 2 clases que usaran el mismo interface. Luego solo queda especificar acá cual de las dos clases de service usar y listo. Fácil de mantener sin tener que tocar controller.
@Module({
	controllers: [GreeterController],
	providers: [{ provide: "Saludo", useClass: GreeterService2 }],
})
export class GreeterModule {}
