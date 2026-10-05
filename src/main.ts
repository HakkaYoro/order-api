import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ExceptionFilter } from "./app.filter";
import { LogInterceptor } from "./app.interceptor";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LogInterceptor());
	app.useGlobalFilters(new ExceptionFilter());
	const config = new DocumentBuilder()
		.addApiKey(
			{
				type: "apiKey",
				name: "x-api-key",
				in: "header",
			},
			"apiKey",
		)
		.setTitle("order-api")
		.setDescription("Api para creación de órdenes.")
		.setVersion("1.0")
		.addTag("orders")
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, documentFactory);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
