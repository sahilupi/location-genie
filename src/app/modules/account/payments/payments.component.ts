import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardNumberComponent,
  StripeService,
} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  StripeElements,
} from '@stripe/stripe-js';
import { CommonService } from 'src/app/services/common.service';
import { Country } from 'src/app/models/common.model';
import { CountryData } from 'src/app/constants/country-list';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { LocalService } from 'src/app/services/local.service';
import { LocalConstant } from 'src/app/constants/local-constant';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { DEFAULT_COUNTRY } from 'src/app/constants/country-code.constant';
import { StripeCardOptions } from 'src/app/constants/stripe.constant';
import { CardData } from 'src/app/models/credit-card.model';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddStripeCardComponent } from '../add-stripe-card/add-stripe-card.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  providers: [FilterPipe],
})
export class PaymentsComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) cardNumber: StripeCardNumberComponent;
  @ViewChild(StripeCardExpiryComponent) cardExpiry: StripeCardExpiryComponent;
  @ViewChild(StripeCardCvcComponent) cardCvc: StripeCardCvcComponent;
  defaultCountry: Country = DEFAULT_COUNTRY;
  stripeForm: FormGroup;
  tokenId: string = '';
  showCountryList: boolean = false;
  countriesList: Country[] = CountryData;
  email: string = '';
  cardOptions: StripeCardElementOptions = StripeCardOptions.cardOptions;
  elementsOptions: StripeElementsOptions = StripeCardOptions.elementsOptions;
  elements: StripeElements;
  isLoading = false;
  isFutureDate = false;
  maxlengthCVC = 3;
  cards: CardData[];
  isSubmittedStripeForm = false;
  isCardFocused = false;
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

  constructor(
    protected commonService: CommonService,
    private filter: FilterPipe,
    private localService: LocalService,
    private personalInfoService: PersonalInfoService,
    private dialog: MatDialog,
    private spinner: SpinnerService
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

      const userData = await this.localService.getLocalData(
        LocalConstant.USER_DATA
      );
      this.email = userData.user_name;
      // to focus into selcted counrty name
      const names = this.countriesList.map((country) => country.name);
      document
        .getElementsByClassName('autocomplete-content-item-id')
        [names.indexOf(this.defaultCountry.name)]?.scrollIntoView();

      window.scrollTo({
        top: 0,
      });

      await this.getPaymentMethod();
      this.handleCardValidations();
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

  private async getPaymentMethod(): Promise<void> {
    const response = await this.personalInfoService.getPaymentCards();
    if (response && response.success) {
      this.cards = response.data.response;
    }
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

  // updateMonthValidation(event: Event): void {
  //   const value = (event.target as HTMLInputElement).value;
  //   const month = this.stripeForm.value.monthYear;

  //   if (month && month.charAt(0) > 1) {
  //     this.stripeForm.patchValue({
  //       monthYear: '0' + value,
  //     });
  //     this.stripeForm.value.monthYear = '0' + value;
  //   }
  //   if (month && month.slice(0, 2) > 12) {
  //     this.stripeForm.patchValue({
  //       monthYear: '0' + month,
  //     });
  //     this.stripeForm.value.monthYear = '0' + value;
  //   }
  //   if (month.length > 3) {
  //     this.getDiff(month);
  //   }
  // }

  // parseDate(e: string): Date {
  //   if (e.length == 3) {
  //     e = '0' + e;
  //   }
  //   return new Date(`${e.substring(0, 2)}/1/${e.slice(-2)}`);
  // }

  // getDiff(e: string): void {
  //   let curr = new Date();
  //   let dt = this.parseDate(e);
  //   if (
  //     dt.getMonth() -
  //       curr.getMonth() +
  //       12 * (dt.getFullYear() - curr.getFullYear()) >
  //     3
  //   ) {
  //     this.isFutureDate = true;
  //   } else {
  //     this.isFutureDate = false;
  //   }
  // }

  // async onSaveCard(): Promise<void> {
  //   this.isSubmittedStripeForm = true;
  //   if (!this.stripeForm.valid) {
  //     return;
  //   }
  //   const name = this.stripeForm.value.name;
  //   const country = this.stripeForm.value.countryCode;
  //   const cvc = this.stripeForm.value.cvc;
  //   const zip = this.stripeForm.value.zip;
  //   const monthYear = this.stripeForm.value.monthYear;
  //   const card = this.stripeForm.value.card;

  //   const payload = {
  //     cardNumber: card,
  //     expiryMonth: monthYear.slice(0, 2),
  //     expiryYear: monthYear.slice(2),
  //     cvc: cvc,
  //     nameOnCard: name,
  //     countryAndRegion: country,
  //     zipCode: zip,
  //   };
  //   const resposne = await this.personalInfoService.createCustomer(payload);
  //   if (resposne && resposne.success) {
  //     await this.getPaymentMethod();
  //     this.stripeForm.reset();
  //     this.isSubmittedStripeForm = false;
  //     window.scrollTo({
  //       top: 0,
  //       behavior: 'smooth',
  //     });
  //   }
  // }

  onDeleteCard(id: string) {
    const dialogData = {
      title: 'Confirm Delete?',
      message: 'Are you sure you want to delete card?',
      cancelBtnText: 'Cancel',
      confirmBtnText: 'Delete',
      isDeleting: true,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (dialogResult === true) {
        const response = await this.personalInfoService.deletePaymentCard(id);
        if (response && response.success) {
          this.cards = this.cards.filter((card) => card.id !== id);
        }
      }
    });
  }

  addCard(): void {
    const dialogRef = this.dialog.open(AddStripeCardComponent, {
      width: '600px',
      height: 'auto',
      data: {
        cardLength: this.cards ? this.cards.length : 0,
      },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === true) {
        await this.getPaymentMethod();
      }
    });
  }

  // createStripeSource(token: any): void {
  //   this.stripeService
  //     .createSource({ token: token.id, type: 'card' })
  //     .subscribe((res) => {
  //       console.log(res);
  //     });
  // }
}
