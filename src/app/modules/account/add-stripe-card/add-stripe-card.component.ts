import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  StripeCardElementOptions,
  StripeElements,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import {
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardNumberComponent,
  StripeService,
} from 'ngx-stripe';
import { DEFAULT_COUNTRY } from 'src/app/constants/country-code.constant';
import { CountryData } from 'src/app/constants/country-list';
import { StripeCardOptions } from 'src/app/constants/stripe.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { Country } from 'src/app/models/common.model';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { CommonService } from 'src/app/services/common.service';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-add-stripe-card',
  templateUrl: './add-stripe-card.component.html',
  styleUrls: ['./add-stripe-card.component.scss'],
  providers: [FilterPipe],
})
export class AddStripeCardComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) cardNumber: StripeCardNumberComponent;
  @ViewChild(StripeCardExpiryComponent) cardExpiry: StripeCardExpiryComponent;
  @ViewChild(StripeCardCvcComponent) cardCvc: StripeCardCvcComponent;
  defaultCountry: Country = DEFAULT_COUNTRY;
  showCountryList: boolean = false;
  countriesList: Country[] = CountryData;
  email: string = '';
  cardOptions: StripeCardElementOptions = StripeCardOptions.cardOptions;
  elementsOptions: StripeElementsOptions = StripeCardOptions.elementsOptions;
  elements: StripeElements;
  stripeForm: FormGroup;
  tokenId: string = '';
  isSubmittedStripeForm = false;
  isLoading = false;
  cardNumberValidations = {
    isCardNumberTouched: false,
    isCardNumberEmpty: true,
    isCardNumberComplete: false,
  };
  cardCvcValidations = {
    isCardCvcTouched: false,
    isCardCvcEmpty: true,
    isCardCvcComplete: false,
  };
  cardExpiryValidations = {
    isCardExpiryTouched: false,
    isCardExpiryEmpty: true,
    isCardExpiryComplete: false,
  };
  showCancelBtn = true;

  constructor(
    private stripeService: StripeService,
    private spinner: SpinnerService,
    protected commonService: CommonService,
    private filter: FilterPipe,
    private personalInfoService: PersonalInfoService,
    private snackbar: SnackBarService,
    public dialogRef: MatDialogRef<AddStripeCardComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { cardLength: number }
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.stripeForm = new FormGroup({
        name: new FormControl(null, [Validators.required]),
        monthYear: new FormControl(null),
        card: new FormControl(null),
        zip: new FormControl(null, [Validators.required]),
        cvc: new FormControl(null),
        countryName: new FormControl(this.defaultCountry.name, [
          Validators.required,
        ]),
        countryCode: new FormControl(this.defaultCountry.code),
      });

      // const userData = await this.localService.getLocalData(
      //   LocalConstant.USER_DATA
      // );
      // this.email = userData.user_name;
      // to focus into selcted counrty name
      setTimeout(() => {
        this.handleCardValidations();
      }, 1000);
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private handleCardValidations(): void {
    this.cardNumber.change.subscribe((result) => {
      this.cardNumberValidations = {
        isCardNumberTouched: true,
        isCardNumberComplete: result.complete,
        isCardNumberEmpty: result.empty,
      };
    });
    this.cardCvc.change.subscribe((result) => {
      this.cardCvcValidations = {
        isCardCvcTouched: true,
        isCardCvcComplete: result.complete,
        isCardCvcEmpty: result.empty,
      };
    });
    this.cardExpiry.change.subscribe((result) => {
      this.cardExpiryValidations = {
        isCardExpiryTouched: true,
        isCardExpiryComplete: result.complete,
        isCardExpiryEmpty: result.empty,
      };
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.stripeForm.controls;
  }

  onFilterCountry(event: any): void {
    this.countriesList = CountryData;
    const key = event.keyCode;
    if (key === 8 || key === 46) {
      this.countriesList = this.filter.transform(
        this.countriesList,
        event.target.value
      );
    } else {
      this.countriesList = this.filter.transform(
        this.countriesList,
        event.target.value
      );
    }
  }

  onFocusCountry(): void {
    this.showCountryList = true;
    const el = document.getElementById('country-list');
    setTimeout(() => {
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
        });
      }
      const names = this.countriesList.map((country) => country.name);
      document
        .getElementsByClassName('autocomplete-content-item-id')
        [names.indexOf(this.defaultCountry.name)]?.scrollIntoView();
    }, 200);
  }

  onBlurCountry(): void {
    this.showCountryList = false;
    this.stripeForm.patchValue({
      countryName: this.defaultCountry.name,
    });
    this.stripeForm.patchValue({
      countryCode: this.defaultCountry.code,
    });
    this.countriesList = CountryData;
  }

  onSelectCountry(countryName: string, countryCode: string): void {
    this.stripeForm.patchValue({
      countryName: countryName,
      countryCode: countryCode,
    });
    this.defaultCountry.name = countryName;
    this.defaultCountry.code = countryCode;
    this.countriesList = CountryData;
  }

  get cardInvalid(): boolean {
    return (
      (this.c['card'].value &&
        this.c['card'].value.length === 16 &&
        !this.commonService.luhnCheck(this.c['card'].value)) ||
      (this.c['card'].value &&
        this.c['card'].value.length === 15 &&
        !this.commonService.isValidAmexCard(this.c['card'].value))
    );
  }

  createToken(): void {
    // this.stripeService
    const name = this.stripeForm.value.name;
    const country = this.stripeForm.value.countryName;
    const zip = this.stripeForm.value.zip;
    this.isSubmittedStripeForm = true;
    if (
      this.stripeForm.invalid ||
      !this.cardExpiryValidations.isCardExpiryComplete ||
      !this.cardCvcValidations.isCardCvcComplete ||
      !this.cardNumberValidations.isCardNumberComplete
    )
      return;
    this.isLoading = true;
    this.spinner.show();
    // if user has cards, then pm token else tok token
    if (this.data.cardLength > 0) {
      this.stripeService
        .createPaymentMethod({
          type: 'card',
          card: this.cardNumber.element,
        })
        .subscribe({
          next: async (result) => {
            if (result && result.paymentMethod && result.paymentMethod?.id) {
              this.tokenId = String(result.paymentMethod?.id);
              const response =
                await this.personalInfoService.updatePaymentMethod(
                  this.tokenId
                );
              this.isLoading = false;
              if (response && response.success) {
                // await this.getPaymentMethod();
                this.snackbar.success(SuccessConstant.PAYMENT_ADDED);
                this.spinner.hide();
                this.stripeForm.reset();
                this.isSubmittedStripeForm = false;
                this.isLoading = false;
                this.dialogRef.close(true);
              } else {
                this.spinner.hide();
                this.isLoading = false;
              }
              // this.createStripeSource(result.token);
            } else {
              this.isLoading = false;
              this.spinner.hide();
              this.snackbar.error('Card rejected');
            }
          },
          error: () => {
            this.spinner.hide();
            this.isLoading = false;
          },
        });
    } else {
      this.stripeService
        .createToken(this.cardNumber.element, {
          name: name,
          address_country: country,
          address_zip: zip,
        })
        .subscribe({
          next: async (result) => {
            if (result.token) {
              this.tokenId = String(result.token.id);
              const response =
                await this.personalInfoService.updatePaymentMethod(
                  this.tokenId
                );
              this.isLoading = false;
              if (response && response.success) {
                // await this.getPaymentMethod();
                this.snackbar.success(SuccessConstant.PAYMENT_ADDED);
                this.spinner.hide();
                this.stripeForm.reset();
                this.isSubmittedStripeForm = false;
                this.isLoading = false;
                this.dialogRef.close(true);
              } else {
                this.spinner.hide();
                this.isLoading = false;
              }
              // this.createStripeSource(result.token);
            } else if (result.error) {
              this.isLoading = false;
              this.spinner.hide();
              this.snackbar.error(String(result.error.message));
            }
          },
          error: () => {
            this.spinner.hide();
            this.isLoading = false;
          },
        });
    }
  }
}
