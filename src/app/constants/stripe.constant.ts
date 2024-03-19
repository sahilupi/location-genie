import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';

export class StripeCardOptions {
  public static cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#333',
        color: 'black',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        lineHeight: '40px',
        backgroundColor: '#fff',
        fontSize: '18px',
        '::placeholder': {
          color: '#333',
        },
      },
    },
  };

  public static elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
}
