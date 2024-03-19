import {
  Component,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginPopupComponent } from 'src/app/auth/login-popup/login-popup.component';
import { LocalConstant } from 'src/app/constants/local-constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { ProjectService } from 'src/app/services/project.service';
import { SharedService } from 'src/app/services/shared.service';
import { SignalrClientService } from 'src/app/services/signalr-client.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isShadowHeader = false;

  isMenuOpen = false;
  isSticky = false;
  isUserAuthenticated = false;
  isHost = false;
  hasHostRole = false;
  authSub$: Subscription;
  hostSub$: Subscription;
  imagesubscription$: Subscription;
  stickyHeaderSub$: Subscription;
  hasHostSub$: Subscription;
  userImageUrl: string;
  userEmail: string;
  defaultUserImageUrl = 'assets/images/dummy/dummy-user.jpg';
  currentUserId: string;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService,
    private localService: LocalService,
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackBarService,
    private personalInfoService: PersonalInfoService,
    private projectSerive: ProjectService,
    private _signalrClientService: SignalrClientService
  ) {
    this.userImageUrl = this.defaultUserImageUrl;
    this.imagesubscription$ = this.sharedService.headerImageUrl$.subscribe(
      (url) => {
        url === ''
          ? (this.userImageUrl = this.defaultUserImageUrl)
          : (this.userImageUrl = url || this.userImageUrl);
      }
    );
    this.stickyHeaderSub$ = this.sharedService
      .getStickyHeader()
      .subscribe((booleanData) => {
        this.isShadowHeader = booleanData;
      });
  }

  async ngOnInit(): Promise<void> {
    const data = await this.localService.getLocalData(LocalConstant.USER_DATA);

    if (data) {
      const userPayload = JSON.parse(atob(data.access_token.split('.')[1]));
      this.currentUserId = userPayload.sub;
      this.userEmail = data.user_name ? data.user_name : data.email;
      await this.getUserIamge();
    }
    await this.isAuthenticated();
    await this.isHostLoggedIn();
    await this.getHasHostRole();
    await this.havingHostRole();
  }

  openLoginDlg(isLoggingIn: boolean): void {
    this.dialog.open(LoginPopupComponent, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
      data: {
        isLoggingIn: isLoggingIn,
      },
    });
  }

  onToggleMobileMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private async havingHostRole(): Promise<void> {
    const response = await this.localService.getLocalData(
      LocalConstant.HAS_HOST_ROLE
    );
    if (response) {
      this.hasHostRole = true;
    }
  }

  private async isAuthenticated(): Promise<void> {
    this.authSub$ = this.sharedService
      .getUserLoggedIn()
      .subscribe(async (data: boolean) => {
        this.isUserAuthenticated = data;
        const userData = await this.localService.getLocalData(
          LocalConstant.USER_DATA
        );
        if (data) {
          const userPayload = JSON.parse(
            atob(userData.access_token.split('.')[1])
          );
          this.currentUserId = userPayload.sub;
          this.userEmail = userData.user_name
            ? userData.user_name
            : userData.email;
          await this.getUserIamge();
        }
      });

    if (await this.authService.isUserLoggedIn()) {
      this.isUserAuthenticated = true;
    }
  }

  private async isHostLoggedIn(): Promise<void> {
    this.hostSub$ = this.sharedService
      .getHostLoggedIn()
      .subscribe(async (data: boolean) => {
        this.isHost = data;
      });

    if (await this.authService.getHostInfo()) {
      this.isHost = true;
    }
  }

  private async getHasHostRole(): Promise<void> {
    this.hasHostSub$ = this.sharedService
      .getHasHostRole()
      .subscribe(async (data: boolean) => {
        this.hasHostRole = data;
      });

    if (await this.authService.hasHostRole()) {
      this.hasHostRole = true;
    }
  }

  async getUserIamge(): Promise<void> {
    const response = await this.personalInfoService.personalInfoGetApi(
      this.userEmail
    );
    if (
      response &&
      response.success &&
      response.data &&
      !response.data.profilePic
    ) {
      this.sharedService.updateHeaderImageUrl('');
      return;
    }
    if (
      response &&
      response.success &&
      response.data &&
      response.data.profilePic
    ) {
      if (response.data.profilePic.includes('https')) {
        // for facebook image url
        this.userImageUrl = response.data.profilePic;
        this.sharedService.updateHeaderImageUrl(this.userImageUrl);
      } else if (!response.data.profilePic.includes('https')) {
        // for Image upload url
        this.userImageUrl = response.data.profilePic;
        this.sharedService.updateHeaderImageUrl(this.userImageUrl);
      }
    }
  }

  async setHostToLocal(): Promise<void> {
    const response = await this.authService.switchRole(
      this.userEmail,
      false,
      true
    );
    if (response && response.success) {
      const userData = response.data;
      await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
      await this.localService.setLocalData(LocalConstant.IS_HOST, true);
      // this.sharedService.setHostLoggedIn(true);
      if (this.router.url.includes('/projects')) {
        location.href = '/';
      } else {
        location.reload();
      }
    }
  }

  async removeHostFromLocal(): Promise<void> {
    const response = await this.authService.switchRole(
      this.userEmail,
      true,
      false
    );
    if (response && response.success) {
      const userData = response.data;
      await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
      await this.localService.removeLocalData(LocalConstant.IS_HOST);
      // this.sharedService.setHostLoggedIn(false);
      if (
        this.router.url.includes('/my-listings') ||
        this.router.url.includes('/become-a-host')
      ) {
        location.href = '/';
      } else {
        location.reload();
      }
    }
  }

  async logout(): Promise<void> {
    this.userImageUrl = this.defaultUserImageUrl;
    await this.localService.removeLocalData(LocalConstant.USER_DATA);
    await this.localService.removeLocalData(LocalConstant.USER_IMAGE);
    await this.localService.removeLocalData(LocalConstant.IS_HOST);
    await this.localService.removeLocalData(LocalConstant.HAS_HOST_ROLE);
    this.sharedService.setUserLoggedIn(false);
    this.sharedService.setHasHostRole(false);
    this.sharedService.setHostLoggedIn(false);
    this.router.navigate(['/']);
    this.projectSerive.selectedProjectListings = [];
    this.sharedService.setSelectedProjectListings([]);
    this.snackbar.success(SuccessConstant.USER_LOGGED_OUT);
    await this._signalrClientService.revokeConnection(this.currentUserId);
  }

  ngOnDestroy(): void {
    this.authSub$?.unsubscribe();
    this.hostSub$?.unsubscribe();
    this.imagesubscription$?.unsubscribe();
    this.stickyHeaderSub$?.unsubscribe();
    this.hasHostSub$?.unsubscribe();
  }
}
