import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// Me apoyé BASTANTE con Gemini. En lo que necesité ayuda fué en colocar el boolean en can activate y en los tres consts. Reforzar.
@Injectable()
export class ApiGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest();
		const token = request.headers["x-api-key"];
		if (token !== "orden-secreta") {
			return false;
		}
		return true;
	}
}
