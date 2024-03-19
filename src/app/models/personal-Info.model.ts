export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  newEmailAddress?: string;
  oldEmailAddress?: string;
  password?: string;
  token?: string;
  cardToken?: string;
  companyName?: string;
  about?: string;
  isSendChatResponsesToCellPhone?: boolean;
  isDoNotWantToReceiveMarketingSMS?: boolean;
  isDoNotWantToReceiveMarketingEmail?: boolean;
}

export interface StripeCard {
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc: string;
  nameOnCard?: string;
  countryAndRegion: string;
  zipCode: string;
}
