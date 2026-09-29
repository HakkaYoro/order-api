import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// Me apoyé BASTANTE con Gemini. En lo que necesité ayuda fué en colocar el boolean en can activate y en los tres consts. Reforzar.
@Injectable()
export class ApiGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}
	canActivate(context: ExecutionContext): boolean {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest();
		const token = request.headers["x-api-key"];
		const apiKey = this.configService.get("API_KEY");
		if (token !== apiKey) {
			return false;
		}
		return true;
	}
}
