import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LogInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const now = Date.now();
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest();
		const httpMethod = request.method;
		const httpRoute = request.url;
		return next
			.handle()
			.pipe(
				tap(() =>
					console.log(
						`Hey! Alguien está por acá! Hizo un ${httpMethod} en la ruta ${httpRoute}! Tardé ${Date.now() - now}ms!`,
					),
				),
			);
	}
}
