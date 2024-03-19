export interface CardData {
  id: string;
  billingDetails: BillingDetails;
  card: Card;
  checked?: boolean;
}

export interface BillingDetails {
  address: BillingAddress;
  email: string;
  name: string;
  phone: string;
}

export interface BillingAddress {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
}

export interface Card {
  brand: string;
  country: string;
  description: string;
  expMonth: number;
  expYear: number;
  funding: string;
  last4: string;
}
