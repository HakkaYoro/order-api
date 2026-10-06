import { Type } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateNested,
} from "class-validator";

class CreateClienteDto {
	@IsOptional()
	@IsInt()
	id?: number;

	@IsString()
	@IsNotEmpty()
	nomCompleto: string;
}
export class CreateOrderDto {
	@ValidateNested()
	@Type(() => CreateClienteDto)
	cliente: CreateClienteDto;

	@IsString()
	@IsNotEmpty()
	item: string;

	@IsInt()
	@Min(1)
	@Max(99)
	cantidad: number;
}
