import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateOrderDto {
	@IsInt()
	@IsNotEmpty()
	cliente: string;
	@IsString()
	@IsNotEmpty()
	item: string;
	@IsInt()
	@Min(1)
	@Max(99)
	cantidad: number;
}
