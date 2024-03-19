import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { StepThreeData } from 'src/app/constants/step-three.constant';
import { Currency } from 'src/app/models/common.model';
import { CommonService } from 'src/app/services/common.service';
import { ListingStepThreeService } from 'src/app/services/listing-step-three.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-three-fourth-page',
  templateUrl: './step-three-fourth-page.component.html',
  styleUrls: ['./step-three-fourth-page.component.scss'],
})
export class StepThreeFourthPageComponent implements OnInit {
  @Input({ required: true }) listingId: string;

  stepperData = ListingStepperConstant.stepThree;
  backBtnRoute: string;
  nxtBtnRoute: string;
  minHours = 4;
  Math = Math;
  isProduction = true;
  isMeeting = true;
  isEvent = true;
  isAutoPricing = true;
  isSixtoFifteen = true;
  isSixteentoThirty = true;
  isThirtyOnetoFourtyFive = true;
  isFourtySixtoSixty = true;
  isSixtyPlus = true;
  currency: string;
  currencySymbol: string;
  feePercentange = 19;
  currencyList: Currency[] = [
    {
      currencyCode: 'aed',
      currencyName: 'Arab Emirates Dirham',
      currencySymbol: 'AED',
      id: 1,
    },
  ];
  currencyId: number;
  defaultChargesForOneToFivePeople = {
    production: 50,
    event: 75,
    meeting: 38,
  };

  defaultPercentage = {
    forSixtoFifteen: 11,
    forSixteentoThirty: 33.5,
    forThirtyOnetoFourtyFive: 66.8,
    forFourtySixtoSixty: 133.8,
    forSixtyPlus: 166.8,
  };

  // charges for 6-15
  chargesForSixtoFifteen = {
    production: Math.floor(
      this.defaultChargesForOneToFivePeople.production *
        (+this.defaultPercentage.forSixtoFifteen / 100) +
        this.defaultChargesForOneToFivePeople.production
    ),
    event: Math.floor(
      this.defaultChargesForOneToFivePeople.event *
        (+this.defaultPercentage.forSixtoFifteen / 100) +
        this.defaultChargesForOneToFivePeople.event
    ),
    meeting: Math.floor(
      this.defaultChargesForOneToFivePeople.meeting *
        (+this.defaultPercentage.forSixtoFifteen / 100) +
        this.defaultChargesForOneToFivePeople.meeting
    ),
  };

  // charges for 16-30
  chargesForSixteentoThirty = {
    production: Math.floor(
      this.defaultChargesForOneToFivePeople.production *
        (+this.defaultPercentage.forSixteentoThirty / 100) +
        this.defaultChargesForOneToFivePeople.production
    ),
    event: Math.floor(
      this.defaultChargesForOneToFivePeople.event *
        (+this.defaultPercentage.forSixteentoThirty / 100) +
        this.defaultChargesForOneToFivePeople.event
    ),
    meeting: Math.floor(
      this.defaultChargesForOneToFivePeople.meeting *
        (+this.defaultPercentage.forSixteentoThirty / 100) +
        this.defaultChargesForOneToFivePeople.meeting
    ),
  };

  // charges for 31-45
  chargesForThirtyOnetoFourtyFive = {
    production: Math.floor(
      this.defaultChargesForOneToFivePeople.production *
        (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
        this.defaultChargesForOneToFivePeople.production
    ),
    event: Math.floor(
      this.defaultChargesForOneToFivePeople.event *
        (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
        this.defaultChargesForOneToFivePeople.event
    ),
    meeting: Math.floor(
      this.defaultChargesForOneToFivePeople.meeting *
        (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
        this.defaultChargesForOneToFivePeople.meeting
    ),
  };

  // charges for 45-60
  chargesForFourtySixtoSixty = {
    production: Math.floor(
      this.defaultChargesForOneToFivePeople.production *
        (+this.defaultPercentage.forFourtySixtoSixty / 100) +
        this.defaultChargesForOneToFivePeople.production
    ),
    event: Math.floor(
      this.defaultChargesForOneToFivePeople.event *
        (+this.defaultPercentage.forFourtySixtoSixty / 100) +
        this.defaultChargesForOneToFivePeople.event
    ),
    meeting: Math.floor(
      this.defaultChargesForOneToFivePeople.meeting *
        (+this.defaultPercentage.forFourtySixtoSixty / 100) +
        this.defaultChargesForOneToFivePeople.meeting
    ),
  };

  // charges for 60+
  chargesForSixtyPlus = {
    production: Math.floor(
      this.defaultChargesForOneToFivePeople.production *
        (+this.defaultPercentage.forSixtyPlus / 100) +
        this.defaultChargesForOneToFivePeople.production
    ),
    event: Math.floor(
      this.defaultChargesForOneToFivePeople.event *
        (+this.defaultPercentage.forSixtyPlus / 100) +
        this.defaultChargesForOneToFivePeople.event
    ),
    meeting: Math.floor(
      this.defaultChargesForOneToFivePeople.meeting *
        (+this.defaultPercentage.forSixtyPlus / 100) +
        this.defaultChargesForOneToFivePeople.meeting
    ),
  };

  constructor(
    private stepThreeService: ListingStepThreeService,
    protected commonService: CommonService,
    private router: Router,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-3/activities`;
      this.nxtBtnRoute = `/become-a-host/${+this
        .listingId}/step-3/activities-detail`;
      await this.getListingPriceSettings();
      await this.getActivityAttendies(Number(this.listingId));
      await this.getListingPrice(Number(this.listingId));
      await this.getCurrencyList();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private async getActivityAttendies(id: number): Promise<void> {
    const response = await this.stepThreeService.getActivityAttendies(id);
    if (response && response.success && response.data) {
      const data = response.data;
      this.isEvent = data.isEvent;
      this.isMeeting = data.isMeeting;
      this.isProduction = data.isProduction;
    }
  }

  private async getListingPriceSettings(): Promise<void> {
    const response = await this.stepThreeService.getListingPriceSettings();
    if (response && response.success && response.data) {
      const data = response.data;
      const eventIntialPrice = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.initialEvent
      );
      if (eventIntialPrice)
        this.defaultChargesForOneToFivePeople.event = +eventIntialPrice.value;

      const prodcutionIntialPrice = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.initialProduction
      );
      if (prodcutionIntialPrice)
        this.defaultChargesForOneToFivePeople.production =
          +prodcutionIntialPrice.value;

      const meetingIntialPrice = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.initialMeeting
      );
      if (meetingIntialPrice)
        this.defaultChargesForOneToFivePeople.meeting =
          +meetingIntialPrice.value;

      const forSixtoFifteen = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.defaultPercentage.forSixtoFifteen
      );
      if (forSixtoFifteen)
        this.defaultPercentage.forSixtoFifteen = +forSixtoFifteen.value;

      const forSixteentoThirty = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.defaultPercentage.forSixteentoThirty
      );
      if (forSixteentoThirty)
        this.defaultPercentage.forSixteentoThirty = +forSixteentoThirty.value;

      const forThirtyOnetoFourtyFive = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.defaultPercentage.forThirtyOnetoFourtyFive
      );
      if (forThirtyOnetoFourtyFive)
        this.defaultPercentage.forThirtyOnetoFourtyFive =
          +forThirtyOnetoFourtyFive.value;

      const forFourtySixtoSixty = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.defaultPercentage.forFourtySixtoSixty
      );
      if (forFourtySixtoSixty)
        this.defaultPercentage.forFourtySixtoSixty = +forFourtySixtoSixty.value;

      const forSixtyPlus = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.defaultPercentage.forSixtyPlus
      );
      if (forSixtyPlus)
        this.defaultPercentage.forSixtyPlus = +forSixtyPlus.value;

      const serviceFee = data.find(
        (item: { key: string; value: string }) =>
          item.key === StepThreeData.serviceFee
      );
      if (serviceFee) this.feePercentange = +serviceFee.value;

      this.updateListingPriceData();
    }
  }

  private updateListingPriceData() {
    // charges for 6-15
    this.chargesForSixtoFifteen = {
      production: Math.floor(
        this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forSixtoFifteen / 100) +
          this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forSixtoFifteen / 100) +
          this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forSixtoFifteen / 100) +
          this.defaultChargesForOneToFivePeople.meeting
      ),
    };

    // charges for 16-30
    this.chargesForSixteentoThirty = {
      production: Math.floor(
        this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forSixteentoThirty / 100) +
          this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forSixteentoThirty / 100) +
          this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forSixteentoThirty / 100) +
          this.defaultChargesForOneToFivePeople.meeting
      ),
    };

    // charges for 31-45
    this.chargesForThirtyOnetoFourtyFive = {
      production: Math.floor(
        this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
          this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
          this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
          this.defaultChargesForOneToFivePeople.meeting
      ),
    };

    // charges for 45-60
    this.chargesForFourtySixtoSixty = {
      production: Math.floor(
        this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forFourtySixtoSixty / 100) +
          this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forFourtySixtoSixty / 100) +
          this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forFourtySixtoSixty / 100) +
          this.defaultChargesForOneToFivePeople.meeting
      ),
    };

    // charges for 60+
    this.chargesForSixtyPlus = {
      production: Math.floor(
        this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forSixtyPlus / 100) +
          this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forSixtyPlus / 100) +
          this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forSixtyPlus / 100) +
          this.defaultChargesForOneToFivePeople.meeting
      ),
    };
  }

  private async getCurrencyList(): Promise<void> {
    const response = await this.stepThreeService.getAllCurrencies();
    if (
      response &&
      response.success &&
      response.data &&
      response.data.response
    ) {
      this.currencyList = response.data.response;
      if (!this.currencyId) {
        const aedCurrency = this.currencyList.find(
          (currency) => currency.currencyCode.toLowerCase() === 'aed'
        );
        if (aedCurrency && !this.currencyId) {
          this.currencyId = aedCurrency.id;
          this.currencySymbol = aedCurrency.currencySymbol;
        }
      }
    }
  }

  private async getListingPrice(id: number): Promise<void> {
    const response = await this.stepThreeService.getListingPrice(id);
    if (response && response.success && response.data) {
      const data = response.data;
      this.currencyId = response.data.currencyId;
      if (response.data.currency && response.data.currency.currencySymbol)
        this.currencySymbol = response.data.currency.currencySymbol;
      this.defaultChargesForOneToFivePeople = JSON.parse(data.oneToFivePeople);
      this.chargesForSixtoFifteen = JSON.parse(data.sixToFifteenPeople);
      this.chargesForSixteentoThirty = JSON.parse(data.sixteenToThirtyPeople);
      this.chargesForThirtyOnetoFourtyFive = JSON.parse(
        data.thirtyOneToFortyFivePeople
      );
      this.chargesForFourtySixtoSixty = JSON.parse(data.fortySixToSixtyPeople);
      this.chargesForSixtyPlus = JSON.parse(data.sixtyAndAbovePeople);
      this.isSixtoFifteen = data.isSixToFifteenPeople;
      this.isSixteentoThirty = data.isSixteenToThirtyPeople;
      this.isThirtyOnetoFourtyFive = data.isThirtyOneToFortyFivePeople;
      this.isFourtySixtoSixty = data.isFortySixToSixtyPeople;
      this.isSixtyPlus = data.isSixtyAndAbovePeople;
      this.minHours = data.minimumHours;
      this.currency = data.priceCurrency;
      this.isAutoPricing = data.isAutomaticPricing;
    }
  }

  updateValues(): void {
    this.chargesForSixtoFifteen = {
      production: Math.floor(
        +this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forSixtoFifteen / 100) +
          +this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        +this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forSixtoFifteen / 100) +
          +this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        +this.defaultChargesForOneToFivePeople.meeting *
          +(+this.defaultPercentage.forSixtoFifteen / 100) +
          +this.defaultChargesForOneToFivePeople.meeting
      ),
    };

    // charges for 16-30
    this.chargesForSixteentoThirty = {
      production: Math.floor(
        +this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forSixteentoThirty / 100) +
          +this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        +this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forSixteentoThirty / 100) +
          +this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        +this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forSixteentoThirty / 100) +
          +this.defaultChargesForOneToFivePeople.meeting
      ),
    };

    // charges for 31-45
    this.chargesForThirtyOnetoFourtyFive = {
      production: Math.floor(
        +this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
          +this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        +this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
          +this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        +this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forThirtyOnetoFourtyFive / 100) +
          +this.defaultChargesForOneToFivePeople.meeting
      ),
    };

    // charges for 45-60
    this.chargesForFourtySixtoSixty = {
      production: Math.floor(
        +this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forFourtySixtoSixty / 100) +
          +this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        +this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forFourtySixtoSixty / 100) +
          +this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        +this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forFourtySixtoSixty / 100) +
          +this.defaultChargesForOneToFivePeople.meeting
      ),
    };

    // charges for 60+
    this.chargesForSixtyPlus = {
      production: Math.floor(
        +this.defaultChargesForOneToFivePeople.production *
          (+this.defaultPercentage.forSixtyPlus / 100) +
          +this.defaultChargesForOneToFivePeople.production
      ),
      event: Math.floor(
        +this.defaultChargesForOneToFivePeople.event *
          (+this.defaultPercentage.forSixtyPlus / 100) +
          +this.defaultChargesForOneToFivePeople.event
      ),
      meeting: Math.floor(
        +this.defaultChargesForOneToFivePeople.meeting *
          (+this.defaultPercentage.forSixtyPlus / 100) +
          +this.defaultChargesForOneToFivePeople.meeting
      ),
    };
  }

  hasValidInput(obj: any): boolean {
    let isValid = true;
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] <= 0) {
        isValid = false;
      }
    }
    return isValid;
  }

  async updateListingPrice(flag?: string): Promise<void> {
    if (!this.hasValidInput(this.defaultChargesForOneToFivePeople)) {
      return;
    }
    const payload = {
      listingId: Number(this.listingId),
      isSixToFifteenPeople: this.isSixtoFifteen,
      isSixteenToThirtyPeople: this.isSixteentoThirty,
      isThirtyOneToFortyFivePeople: this.isThirtyOnetoFourtyFive,
      isFortySixToSixtyPeople: this.isFourtySixtoSixty,
      isSixtyAndAbovePeople: this.isSixtyPlus,
      oneToFivePeople: JSON.stringify(this.defaultChargesForOneToFivePeople),
      sixToFifteenPeople: JSON.stringify(this.chargesForSixtoFifteen),
      sixteenToThirtyPeople: JSON.stringify(this.chargesForSixteentoThirty),
      thirtyOneToFortyFivePeople: JSON.stringify(
        this.chargesForThirtyOnetoFourtyFive
      ),
      fortySixToSixtyPeople: JSON.stringify(this.chargesForFourtySixtoSixty),
      sixtyAndAbovePeople: JSON.stringify(this.chargesForSixtyPlus),
      priceCurrency: this.currency,
      minimumHours: +this.minHours,
      isAutomaticPricing: this.isAutoPricing,
      currencyId: this.currencyId,
    };
    const response = await this.stepThreeService.updateListingPrice(payload);
    if (response && response.success) {
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
      } else {
        this.router.navigateByUrl(this.nxtBtnRoute);
      }
    }
  }

  onChangeSelectedPeople(): void {
    if (!this.isSixtoFifteen) {
      this.isSixteentoThirty = false;
      this.isThirtyOnetoFourtyFive = false;
      this.isFourtySixtoSixty = false;
      this.isSixtyPlus = false;
    }
    if (!this.isSixteentoThirty) {
      this.isThirtyOnetoFourtyFive = false;
      this.isFourtySixtoSixty = false;
      this.isSixtyPlus = false;
    }
    if (!this.isThirtyOnetoFourtyFive) {
      this.isFourtySixtoSixty = false;
      this.isSixtyPlus = false;
    }
    if (!this.isFourtySixtoSixty) {
      this.isSixtyPlus = false;
    }
  }

  onChangeCurrency(event: Event): void {
    this.currencyId = Number((event.target as HTMLInputElement).value);
    const currencySymbolObj = this.currencyList.find(
      (currency) => currency.id === this.currencyId
    );
    if (currencySymbolObj)
      this.currencySymbol = currencySymbolObj.currencySymbol;
  }
}
