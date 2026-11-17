export class Money {
	readonly value: number;

	constructor(value: number) {
		this.validate(value);
		this.value = value;
	}

	private validate(value: number): void {
		if (!Number.isInteger(value) || value < 0) {
			throw new Error("El valor debe ser un número entero no negativo.");
		}
	}

	public suma(otro: Money): Money {
		return new Money(this.value + otro.value);
	}

	public equals(otro: Money): boolean {
		return this.value === otro.value;
	}
}
