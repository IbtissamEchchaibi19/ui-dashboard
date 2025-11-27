// domain/value-objects/Money.ts
export interface MoneyValue {
  amount: number;
  currency: string;
}

export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {}

  static create(amount: number, currency: string = 'USD'): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    return new Money(amount, currency);
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return new Money(Math.max(0, this.amount - other.amount), this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  /**
   * ➕ Newly added (missing in first file)
   * Divide money by a factor
   */
  divide(factor: number): Money {
    if (factor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this.amount / factor, this.currency);
  }

  /**
   * ➕ Newly added
   * Check if exactly equal to another Money object
   */
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  /**
   * ➕ NEW method (safe)
   * Symbol-based formatting WITHOUT modifying the original format()
   */
  formatWithSymbol(): string {
    const symbols: Record<string, string> = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };

    const symbol = symbols[this.currency] || this.currency;

    return `${symbol}${this.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /**
   * ORIGINAL — unchanged
   */
  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }

  /**
   * ORIGINAL — unchanged
   */
  toJSON(): MoneyValue {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
