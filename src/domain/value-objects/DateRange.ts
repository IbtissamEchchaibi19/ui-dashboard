export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export class DateRangeVO {
  private constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {}

  static create(startDate: Date, endDate: Date): DateRangeVO {
    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }
    return new DateRangeVO(startDate, endDate);
  }

  static fromDays(days: number): DateRangeVO {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    return new DateRangeVO(startDate, endDate);
  }

  static last7Days(): DateRangeVO {
    return DateRangeVO.fromDays(7);
  }

  static last30Days(): DateRangeVO {
    return DateRangeVO.fromDays(30);
  }

  static thisMonth(): DateRangeVO {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    return new DateRangeVO(startDate, now);
  }

  getDaysDifference(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toJSON(): DateRange {
    return {
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }

  // ----------------------------------------------------
  // ✅ Added Methods From Second File (unchanged logic)
  // ----------------------------------------------------

  /**
   * Check if a date falls within this range
   */
  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  /**
   * Get the number of days in this range (inclusive)
   */
  getDays(): number {
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * Format the date range as a string
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
}
