export class Money {
  private cents: number;
  private currency: string;

  private constructor(cents: number, currency = "RUB") {
    this.cents = cents;
    this.currency = currency;
  }

  static fromCents(cents: number, currency = "RUB") {
    return new Money(Math.round(cents), currency);
  }

  static fromRubles(rubles: number, currency = "RUB") {
    return new Money(Math.round(rubles * 100), currency);
  }

  static formatCents(
    cents: number | null | undefined,
    locale = "ru-RU",
    currency = "RUB"
  ) {
    const safe = Number.isFinite(Number(cents)) ? Number(cents) : 0;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(safe / 100);
  }

  asCents() {
    return this.cents;
  }

  add(other: Money) {
    return new Money(this.cents + other.cents, this.currency);
  }

  toString() {
    return Money.formatCents(this.cents, "ru-RU", this.currency);
  }
}

export default Money;
