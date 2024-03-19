import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { LoginPopupComponent } from 'src/app/auth/login-popup/login-popup.component';
import { DEFAULT_COUNTRY } from 'src/app/constants/country-code.constant';
import { CountryData } from 'src/app/constants/country-list';
import { DubaiEmirates } from 'src/app/constants/dubai-emirates';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { LocalConstant } from 'src/app/constants/local-constant';
import { UserConstant } from 'src/app/constants/user.constant';
import { LoginUserData } from 'src/app/models/auth.model';
import { BaseResonse, Country } from 'src/app/models/common.model';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';
import { LocalService } from 'src/app/services/local.service';
import { SharedService } from 'src/app/services/shared.service';
import { SpinnerService } from 'src/app/services/spinner.service';

declare global {
  interface Window {
    autoCompleteService: (value: string) => void;
  }
}

@Component({
  selector: 'app-list-new',
  templateUrl: './list-new.component.html',
  styleUrls: ['./list-new.component.scss'],
  providers: [FilterPipe],
})
export class ListNewComponent implements OnInit {
  @Input() listingId: string;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;

  addressForm: FormGroup;
  countriesList: Country[] = [...CountryData];
  tempCountriesList: Country[] = [...CountryData];
  defaultCountry: Country = { ...DEFAULT_COUNTRY };
  tempDefaultCountry: Country = { ...DEFAULT_COUNTRY };
  dubaiEmirates = [...DubaiEmirates];
  stepperData = [...ListingStepperConstant.stepOne];
  role = UserConstant.userRoles.user;
  predictions: any[] = [];
  roles: string[] = [];
  email: string = '';
  selectedEmirate: string = '';
  filteredCities: string[] = [];
  streetAddress: string = '';
  searchValue = '';
  backBtnRoute: string = '/landing-owner';
  showCountryList: boolean = false;
  showAutoComplete: boolean = false;
  isUserAuthenticated = false;
  isSubmitted = false;
  isInitComponent = true;
  googleApiError = false;
  zipCode: string = '';
  latitude: number = 0;
  longitude: number = 0;

  constructor(
    private filter: FilterPipe,
    public commonService: CommonService,
    private listingStepOneService: ListingStepOneService,
    private router: Router,
    private authService: AuthService,
    private localService: LocalService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      window.autoCompleteService = this.autoCompleteService;
      await this.addressFormInit();
      this.addressForm.controls['streetAddress'].valueChanges
        .pipe(debounceTime(400))
        .subscribe(async (searchTerm) => {
          // this.isSearching = true;
          this.searchValue = searchTerm.trim().toLowerCase();
          if (
            !this.searchValue ||
            this.searchValue.trim().length < 2 ||
            this.isInitComponent
          ) {
            return;
          }
          this.autoCompleteService(this.searchValue);
        });
      setTimeout(() => {
        this.isInitComponent = false;
      }, 1000);
      await this.getCountriesList();
      if (this.listingId) {
        await this.getListing(+this.listingId);
      }
      await this.isAuthenticated();
      await this.getLocalUser();

      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private async getLocalUser(): Promise<void> {
    const userData: LoginUserData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    this.email = userData.user_name ? userData.user_name : userData.email;
    if (userData) {
      const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
      this.role = userPayload.current_role;
      this.roles = userPayload.role;
    }
  }

  private async addressFormInit(): Promise<void> {
    this.addressForm = new FormGroup({
      country: new FormControl(this.defaultCountry.name, [Validators.required]),
      aptAndSuite: new FormControl(null),
      streetAddress: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null),
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }

  private async getListing(id: number): Promise<void> {
    const response = await this.listingStepOneService.getListingAddress(id);
    if (
      response &&
      response.success &&
      response.data &&
      response.data.listingAddress
    ) {
      const data = response.data.listingAddress;
      this.streetAddress = data.streetAddress.trim();
      this.addressForm.setValue({
        country: data.country,
        aptAndSuite: data.aptAndSuite ? data.aptAndSuite : null,
        streetAddress: data.streetAddress,
        state: data.state,
        city: data.city,
        zipCode: data.zipCode,
      });
      this.defaultCountry.name = data.country;
      if (
        this.addressForm.value?.country.toLowerCase() !==
        this.tempDefaultCountry.name.toLowerCase()
      ) {
        this.addressForm.controls['state'].clearValidators();
        this.addressForm.controls['state'].updateValueAndValidity();
      }
    }
    const names = this.countriesList.map((country) => country.name);
    document
      .getElementsByClassName('autocomplete-content-item-id')
      [names.indexOf(this.defaultCountry.name)]?.scrollIntoView();
    window.scrollTo({
      top: 0,
    });
  }

  private async isAuthenticated(): Promise<void> {
    if (await this.authService.isUserLoggedIn()) {
      this.isUserAuthenticated = true;
    } else {
      this.isUserAuthenticated = false;
    }
  }

  private async getCountriesList(): Promise<void> {
    const response = await this.listingStepOneService.getCountriesList();
    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      this.countriesList = [];
      this.tempCountriesList = [];
      const data = [...response.data];
      data.forEach((country) => {
        this.countriesList.push({
          name: country.name,
          code: country.countryCode,
        });
        this.tempCountriesList = [...this.countriesList];
      });
    }
  }

  onFilterCountry(event: any): void {
    this.countriesList = this.tempCountriesList;
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
    this.addressForm.patchValue({
      country: '',
    });
  }

  onBlurCountry(): void {
    this.showCountryList = false;
    this.addressForm.patchValue({
      country: this.defaultCountry.name,
    });
    this.countriesList = this.tempCountriesList;
  }

  async onSelectCountry(country: string, countryCode: string): Promise<void> {
    this.addressForm.patchValue({
      country: country,
      countryCode: countryCode,
    });
    this.defaultCountry.name = country;
    this.defaultCountry.code = countryCode;
    // if (country.toLowerCase() !== this.tempDefaultCountry.name.toLowerCase()) {
    //   this.addressForm.controls['state'].clearValidators();
    //   this.addressForm.controls['state'].updateValueAndValidity();
    // }
    // if (country.toLowerCase() === this.tempDefaultCountry.name.toLowerCase()) {
    //   this.addressForm.controls['state'].setValidators(Validators.required);
    //   this.addressForm.controls['state'].updateValueAndValidity();
    // }
    this.defaultCountry.name = country;
    this.defaultCountry.code = countryCode;
    this.countriesList = this.tempCountriesList;
    this.showCountryList = false;
    // this.initService();
  }

  onEmirateChange(emirate: string): void {
    this.selectedEmirate = emirate;
    const selectedEmirateObj = this.dubaiEmirates.find(
      (e) => e.name === emirate
    );
    this.filteredCities = selectedEmirateObj ? selectedEmirateObj.cities : [];
    // Reset the city value when emirate changes
    this.addressForm.patchValue({ city: null });
  }

  async onSubmitForm(flag?: string): Promise<void> {
    this.isSubmitted = true;
    if (!this.addressForm.valid) return;

    if (!this.isUserAuthenticated) {
      this.openLoginDlg(true);
      return;
    }

    const data = this.addressForm.value;
    if (this.listingId) {
      data.listingId = this.listingId;
    }
    if (this.streetAddress.trim() !== data.streetAddress.trim()) {
      await this.getLatLng(data.streetAddress);
    }
    const response = await this.listingStepOneService.updateListingAddress(
      data
    );
    if (response.success && response.data && response.data.listingId) {
      this.listingId = response.data.listingId;
      if (this.streetAddress.trim() !== data.streetAddress.trim()) {
        await this.onSaveLatLong();
      }
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${response.data.listingId}`);
      } else {
        if (
          this.role.toLowerCase() ===
            UserConstant.userRoles.user.toLowerCase() &&
          !this.roles.includes(UserConstant.userRoles.host)
        ) {
          const roleResponse = await this.authService.setToHost(this.email);
          if (roleResponse) {
            await this.localService.setLocalData(
              LocalConstant.HAS_HOST_ROLE,
              true
            );
            this.sharedService.setHasHostRole(true);
            const switchRoleResponse = await this.authService.switchRole(
              this.email,
              false,
              true
            );
            if (switchRoleResponse) {
              await this.localService.setLocalData(LocalConstant.IS_HOST, true);
              this.sharedService.setHostLoggedIn(true);
              const userData: LoginUserData = switchRoleResponse.data;
              await this.localService.setLocalData(
                LocalConstant.USER_DATA,
                userData
              );
              await this.localService.setLocalData(LocalConstant.IS_HOST, true);
              this.sharedService.setHostLoggedIn(true);
            }
          }
        }
        if (
          this.role.toLowerCase() ===
            UserConstant.userRoles.user.toLowerCase() &&
          this.roles.includes(UserConstant.userRoles.host)
        ) {
          const switchRoleResponse = await this.authService.switchRole(
            this.email,
            false,
            true
          );
          if (switchRoleResponse) {
            const userData: LoginUserData = switchRoleResponse.data;
            await this.localService.setLocalData(
              LocalConstant.USER_DATA,
              userData
            );
            await this.localService.setLocalData(LocalConstant.IS_HOST, true);
            this.sharedService.setHostLoggedIn(true);
          }
        }
        if (
          this.role.toLowerCase() ===
            UserConstant.userRoles.host.toLowerCase() &&
          this.roles.includes(UserConstant.userRoles.host)
        ) {
          await this.localService.setLocalData(LocalConstant.IS_HOST, true);
          this.sharedService.setHostLoggedIn(true);
        }

        this.router.navigateByUrl(
          `/become-a-host/${response.data.listingId}/step-1/verify-address`
        );
      }
    }
  }

  async onSaveLatLong(): Promise<BaseResonse> {
    const data = {
      longitude: String(this.longitude),
      latitude: String(this.latitude),
      listingId: +this.listingId,
    };

    return await this.listingStepOneService.updateListingLocationPinInfo(data);
  }

  private openLoginDlg(isLoggingIn: boolean): void {
    const dialogRef = this.dialog.open(LoginPopupComponent, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
      data: {
        isLoggingIn: isLoggingIn,
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (await this.authService.isUserLoggedIn()) {
        this.isUserAuthenticated = true;
        await this.getLocalUser();
        await this.onSubmitForm();
      } else {
        this.isUserAuthenticated = false;
      }
    });
  }

  async getLatLng(address: string): Promise<void> {
    // Make a request to the Google Maps Geocoding API
    try {
      const geocoder = new google.maps.Geocoder();
      await geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          this.latitude = location.lat();
          this.longitude = location.lng();
          this.googleApiError = false;
        } else {
          console.error(
            'Geocode was not successful for the following reason:',
            status
          );
          this.googleApiError = true;
        }
      });
    } catch (error) {}
  }

  autoCompleteService(value: string): void {
    if (!value || value.trim().length < 2) return;

    // return;
    const displaySuggestions = (
      predictions: google.maps.places.QueryAutocompletePrediction[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === 'REQUEST_DENIED') {
        this.googleApiError = true;
      } else {
        this.googleApiError = false;
      }
      if (!predictions) {
        if (status === 'ZERO_RESULTS') {
          this.predictions = [];
        }
        return;
      }
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        this.googleApiError = true;
        return;
      } else {
        this.googleApiError = false;
      }

      this.predictions = [...predictions];
    };

    const service = new google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: value.trim(),
        componentRestrictions: {
          country: this.defaultCountry.code.toLowerCase(),
        },
      },
      displaySuggestions
    );
  }

  onSelectStreetAdreess(prediction: any): void {
    this.addressForm.patchValue({
      streetAddress: prediction.terms[0].value,
      city:
        prediction.terms.length > 3
          ? prediction.terms.at(-3).value
          : prediction.terms.at(-2).value,
      state: prediction.terms.at(-2).value,
    });
  }
}
