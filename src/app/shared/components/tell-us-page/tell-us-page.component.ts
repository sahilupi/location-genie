import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSlider } from '@angular/material/slider';
import { Observable, map, startWith } from 'rxjs';
import { COUNTRY_CODE } from 'src/app/constants/country-code.constant';
import { ListingDetails } from 'src/app/constants/listing-details.constant';
import { emailValidator } from 'src/app/constants/patterns.constant';
import { CountryCode } from 'src/app/models/common.model';
import { AttendiesDropdown } from 'src/app/models/location.model';
import { CommonService } from 'src/app/services/common.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-tell-us-page',
  templateUrl: './tell-us-page.component.html',
  styleUrls: ['./tell-us-page.component.scss'],
  providers: [DatePipe]
})
export class TellUsPageComponent implements OnInit {
  @ViewChild(MatSlider) slider: MatSlider;
  enquiryForm: FormGroup;
  isSubmitted = false;
  dialCodeControl!: FormControl;
  filteredCountryCodes!: Observable<CountryCode[]>;
  countryCode: CountryCode[] = COUNTRY_CODE;
  selectedDialCode: string = '+971';
  selectedCountry = 'AE';
  today = new Date();
  showBanner: boolean = false;
  attendiesDropdown: AttendiesDropdown[] = ListingDetails.attendiesDropdown;

  isDialCodeError = false;

  constructor(
    public commonService: CommonService,
    private homeService: HomeService,
    private date: DatePipe
  ) { }

  async ngOnInit(): Promise<void> {
    await this.enquiryFormInit();
  }

  private async enquiryFormInit(): Promise<void> {
    this.dialCodeControl = new FormControl(
      { dialCode: '+971' },
      Validators.required
    );
    this.enquiryForm = new FormGroup({
      projectName: new FormControl(null, [Validators.required]),
      crewAttendees: new FormControl(null, [Validators.required]),
      projectDate: new FormControl(null, [Validators.required]),
      projectSpace: new FormControl(null, [Validators.required]),
      fullName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        emailValidator,
      ]),
      projectLocation: new FormControl(null),
      minBudgetPerDay: new FormControl(200),
      maxBudgetPerDay: new FormControl(20000),
      company: new FormControl(null),
      phoneNumber: new FormControl(null),
    });

    this.filteredCountryCodes = this.dialCodeControl.valueChanges.pipe(
      startWith<string | CountryCode>(''),
      map((value) => (typeof value === 'string' ? value : value.dialCode)),
      map((country) =>
        country ? this.filterCountry(country) : this.countryCode.slice()
      )
    );
  }

  filterCountry(data: string): CountryCode[] {
    const codeData = this.countryCode.filter(
      (option) =>
        option.dialCode.toLowerCase().indexOf(data.toLowerCase()) === 0
    );
    const dialCodeData = this.countryCode.filter(
      (option) => option.code.toLowerCase().indexOf(data.toLowerCase()) === 0
    );
    const result = [...codeData, ...dialCodeData];
    return result;
  }

  displayFn(data?: CountryCode): string {
    return data ? data.dialCode : '+1';
  }

  onChangeCountry(data: CountryCode): void {
    this.selectedCountry = data.code;
    this.selectedDialCode = data.dialCode;
    this.dialCodeControl.patchValue({
      dialCode: this.selectedDialCode,
    });
    this.isDialCodeError = false;
  }

  changeCountry(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.selectedDialCode = value;
    this.countryCode.map((element) => {
      if (element.dialCode === this.selectedDialCode) {
        this.selectedCountry = element.code;
      }
      if (value == '' || value == '+') {
        this.selectedCountry = 'AE';
      }
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.enquiryForm.controls;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;

    this.enquiryForm.patchValue({
      projectDate: date?.toISOString(),
    });
  }

  async onSubmit(): Promise<void> {
    this.isSubmitted = true;
    if (!this.dialCodeControl.value.dialCode) {
      this.isDialCodeError = true;
    }
    if (!this.enquiryForm.valid || !this.dialCodeControl.value.dialCode) return;
    const selectedDate = (this.date.transform(this.enquiryForm.value.projectDate, 'YYYY-MM-dd') as string)
    const payload = {
      email: this.enquiryForm.value.email,
      fullName: this.enquiryForm.value.fullName,
      company: this.enquiryForm.value.company,
      phoneNumber: this.enquiryForm.value.phoneNumber
        ? this.dialCodeControl.value.dialCode +
        '-' +
        this.enquiryForm.value.phoneNumber
        : '',
      projectName: this.enquiryForm.value.projectName,
      crewAttendees: this.enquiryForm.value.crewAttendees,
      projectDate: selectedDate,
      projectLocation: this.enquiryForm.value.projectLocation,
      minBudgetPerDay: this.enquiryForm.value.minBudgetPerDay,
      maxBudgetPerDay: this.enquiryForm.value.maxBudgetPerDay,
      projectSpace: this.enquiryForm.value.projectSpace,
    };

    const response = await this.homeService.addCustomerNeed(payload);

    if (response && response.data && response.data.length > 0) {
      this.showBanner = true;
      window.scrollTo(0, 0);
    }
  }
}
