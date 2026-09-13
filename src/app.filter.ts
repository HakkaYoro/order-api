import {
	ArgumentsHost,
	Catch,
	HttpException,
	ExceptionFilter as NestExceptionFilter,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class ExceptionFilter implements NestExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost) {
		const httpContext = host.switchToHttp();
		const response = httpContext.getResponse<Response>();
		const statusCode = exception.getStatus();
		const message = exception.message;
		response.status(statusCode).json({
			statusCode: statusCode,
			message: message,
			timestamp: new Date().toISOString(),
		});
	}
}
