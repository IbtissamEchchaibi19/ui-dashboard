export class Percentage {
  private constructor(public readonly value: number) {}

  static create(value: number): Percentage {
    if (value < 0 || value > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
    return new Percentage(value);
  }

  static fromDecimal(decimal: number): Percentage {
    return new Percentage(decimal * 100);
  }

  toDecimal(): number {
    return this.value / 100;
  }

  format(decimals: number = 2): string {
    return `${this.value.toFixed(decimals)}%`;
  }

  toJSON(): number {
    return this.value;
  }
}