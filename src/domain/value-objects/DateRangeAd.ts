// domain/value-objects/DateRange.ts 
export class DateRange {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    if (startDate > endDate) {
      throw new Error('Start date must be before or equal to end date');
    }
  }

  /**
   * Check if a date falls within this range
   */
  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  /**
   * Get the number of days in this range
   */
  getDays(): number {
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * Format date range as string
   */
  format(separator: string = ' - '): string {
    return `${this.formatDate(this.startDate)}${separator}${this.formatDate(this.endDate)}`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString()
    };
  }
}