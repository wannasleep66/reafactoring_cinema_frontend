export type CardPayload = {
  cardNumber: string;
  expiryDate: string; // MM/YY or ISO depending on UI
  cvv: string;
  cardHolderName: string;
};

export class Card {
  readonly cardNumber: string;
  readonly expiryDate: string;
  readonly cvv: string;
  readonly cardHolderName: string;

  constructor(payload: CardPayload) {
    this.cardNumber = payload.cardNumber.trim();
    this.expiryDate = payload.expiryDate.trim();
    this.cvv = payload.cvv.trim();
    this.cardHolderName = payload.cardHolderName.trim();
  }

  static from(payload: CardPayload) {
    return new Card(payload);
  }

  isValid(): boolean {
    // basic validation: lengths and numeric checks — keep simple and testable
    const num = this.cardNumber.replace(/\s+/g, "");
    if (!/^\d{12,19}$/.test(num)) return false;
    if (!/^\d{2}\/\d{2}$/.test(this.expiryDate)) return false;
    if (!/^\d{3,4}$/.test(this.cvv)) return false;
    if (this.cardHolderName.length === 0) return false;
    return true;
  }

  mask(): string {
    const num = this.cardNumber.replace(/\s+/g, "");
    if (num.length <= 4) return num;
    return `**** **** **** ${num.slice(-4)}`;
  }

  toApiPayload() {
    return {
      cardNumber: this.cardNumber,
      expiryDate: this.expiryDate,
      cvv: this.cvv,
      cardHolderName: this.cardHolderName,
    } as CardPayload;
  }
}

export default Card;
