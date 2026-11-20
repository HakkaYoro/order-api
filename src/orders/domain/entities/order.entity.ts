import { CantidadDelNegocio } from "../value-objects/cantidad-del-negocio";
import { Money } from "../value-objects/money";

export class OrderDelNegocio {
	readonly cantidad: CantidadDelNegocio;
	readonly total: Money;

	private constructor(
		cantidad: CantidadDelNegocio,
		precioUnitarioCentavos: number,
	) {
		this.cantidad = cantidad;
		this.total = new Money(precioUnitarioCentavos * cantidad.value);
	}

	public static crear(
		cantidad: number,
		precioUnitarioCentavos: number,
	): OrderDelNegocio {
		return new OrderDelNegocio(
			new CantidadDelNegocio(cantidad),
			precioUnitarioCentavos,
		);
	}

	public agregarItem(
		cantidad: number,
		precioUnitarioCentavos: number,
	): OrderDelNegocio {
		const cantidadNueva = this.cantidad.suma(new CantidadDelNegocio(cantidad));
		return new OrderDelNegocio(cantidadNueva, precioUnitarioCentavos);
	}
}
