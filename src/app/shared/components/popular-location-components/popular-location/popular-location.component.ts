import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { filter } from 'rxjs';
import { LoginPopupComponent } from 'src/app/auth/login-popup/login-popup.component';
import { NgxCarousalOptions } from 'src/app/constants/ngx-carousal-options';
import { LocationList } from 'src/app/models/location.model';
import { Project } from 'src/app/models/project.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-popular-location',
  templateUrl: './popular-location.component.html',
  styleUrls: [
    './popular-location.component.scss',
    '../popular-locations/popular-locations.component.scss',
  ],
})
export class PopularLocationComponent implements OnInit {
  @Input() class = '';
  @Input({ required: true }) locationData: LocationList;
  @Input({ required: true }) selectedProjectListings: any[] = [];
  @Input() height = '175px';
  @Input() className = 'custom-height';
  charegesPerHour: number = 50;
  priceCurrency: string = 'د.إ';
  projects: Project[];
  dummyImage = 'assets/images/dummy/default_image.png';
  customOptions: OwlOptions = NgxCarousalOptions.popularLocationCustomOptions;
  isLoading = false;
  encryptedListingId: string;
  alignArrow: boolean;
  overAllRatings = 0;

  constructor(
    private projectService: ProjectService,
    private snackbar: SnackBarService,
    private authService: AuthService,
    private projectSerive: ProjectService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.encryptedListingId = btoa(String(this.locationData.listingId));
    if (this.locationData.listing?.overallRatings) {
      this.overAllRatings = Number(this.locationData.listing?.overallRatings);
    }
    if (this.locationData.listingPrice?.oneToFivePeople)
      this.charegesPerHour = JSON.parse(
        this.locationData.listingPrice?.oneToFivePeople
      ).meeting;

    if (this.locationData.listingPrice?.currency)
      this.priceCurrency =
        this.locationData.listingPrice?.currency.currencySymbol;
  }

  async getProjects(): Promise<void> {
    if (!(await this.authService.isUserLoggedIn())) {
      this.projects = [];
      this.dialog.open(LoginPopupComponent, {
        width: '600px',
        disableClose: true,
        autoFocus: false,
        data: {
          isLoggingIn: true,
        },
      });
    }
    // &&
    // (!this.projects || this.projects.length <= 0)
    if (await this.authService.isUserLoggedIn()) {
      this.isLoading = true;
      const response = await this.projectService.getProjects();
      if (response && response.success && response.data) {
        this.projects = response.data;
      }
      this.isLoading = false;
    }
  }

  private async getSelectedProjectListings() {
    const response = await this.projectSerive.getAllSelectedProjectLocations();
    if (
      response &&
      response.success &&
      response.data &&
      response.data.listingId
    ) {
      this.projectSerive.selectedProjectListings = response.data.listingId;
      this.selectedProjectListings = response.data.listingId;
      this.sharedService.setSelectedProjectListings(response.data.listingId);
    }
  }

  async onAddLocationToProject(
    projectId: number,
    isSelected: boolean,
    listingId?: number
  ): Promise<void> {
    if (await this.authService.isUserLoggedIn()) {
      const payload = {
        projectId,
        listingId,
        isSelected: isSelected,
      };
      const response = await this.projectService.onAddLocationToProject(
        payload
      );
      if (response && response.success) {
        await this.getSelectedProjectListings();
        if (listingId) await this.getProjects();
        this.snackbar.success(response.data);
      }
    }
  }
}
