
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'INR'
  ) {}

  /**
   * Format money as string with currency symbol
   */
  format(): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'INR': '₹',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥'
    };

    const symbol = symbols[this.currency] || this.currency;
    return `${symbol}${this.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  /**
   * Add two Money objects
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Subtract two Money objects
   */
  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  /**
   * Multiply money by a factor
   */
  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  /**
   * Divide money by a factor
   */
  divide(factor: number): Money {
    if (factor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this.amount / factor, this.currency);
  }

  /**
   * Check if equal to another Money object
   */
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency
    };
  }
}