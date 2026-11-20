export class CantidadDelNegocio {
	readonly value: number;

	constructor(value: number) {
		// rango acotado hasta 10000; evita pedidos ni vacíos ni excesivos sin inventar una política mayor.
		if (!Number.isInteger(value) || value < 1 || value > 10000) {
			throw new Error("La cantidad debe ser un entero entre 1 y 10000.");
		}
		this.value = value;
	}

	public suma(otra: CantidadDelNegocio): CantidadDelNegocio {
		return new CantidadDelNegocio(this.value + otra.value);
	}
}
