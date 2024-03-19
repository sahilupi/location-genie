import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FacebookAuthProvider } from 'firebase/auth';
import { LocalConstant } from 'src/app/constants/local-constant';
import { LocalService } from 'src/app/services/local.service';
import { SharedService } from 'src/app/services/shared.service';
import { EditProfileImageComponent } from '../edit-profile-image/edit-profile-image.component';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { Account } from 'src/app/constants/account.constant';

@Component({
  selector: 'app-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss'],
})
export class AccountSidebarComponent implements OnInit, OnDestroy {
  defaultUserImageUrl: string = 'assets/images/dummy/dummy-user.jpg';
  userImageUrl: string = this.defaultUserImageUrl;
  isImageAvailable: boolean = false;
  userEmail: string;
  imagesubscription$: Subscription;
  isMenuOpen = false;
  accountMenuList = [...Account.accountMenuList];

  constructor(
    private sharedService: SharedService,
    private afAuth: AngularFireAuth,
    private localService: LocalService,
    public dialogRef: MatDialogRef<EditProfileImageComponent>,
    private dialog: MatDialog,
    private personalInfoService: PersonalInfoService
  ) {
    // this.sharedService.setStickyHeader(true);

    this.imagesubscription$ = this.sharedService.headerImageUrl$.subscribe(
      (url) => {
        url === ''
          ? ((this.userImageUrl = this.defaultUserImageUrl),
            (this.isImageAvailable = false))
          : (this.userImageUrl = url || this.userImageUrl);
      }
    );
  }

  async ngOnInit(): Promise<void> {
    const data = await this.localService.getLocalData(LocalConstant.USER_DATA);
    this.userEmail = data.user_name ? data.user_name : data.email;
    const response = await this.personalInfoService.personalInfoGetApi(
      this.userEmail
    );
    if (
      response &&
      response.success &&
      response.data &&
      response.data.profilePic
    ) {
      if (response.data.profilePic.includes('https')) {
        // for facebook image url
        this.userImageUrl = response.data.profilePic;
        this.isImageAvailable = true;
      }
      if (!response.data.profilePic.includes('https')) {
        // for Image upload url
        this.userImageUrl = response.data.profilePic;
        this.isImageAvailable = true;
      }
    }
  }

  async updateUserImage(): Promise<void> {
    const data = await this.localService.getLocalData(LocalConstant.USER_DATA);
    this.userEmail = data.user_name ? data.user_name : data.email;
    const result = await this.afAuth.signInWithPopup(
      new FacebookAuthProvider()
    );
    if (result.credential) {
      const profile = result.additionalUserInfo?.profile as any;
      const imageUrl = profile.picture.data.url;
      this.userImageUrl = imageUrl;
      const formData = new FormData();
      formData.append('UploadProfileImgUrl', '');
      formData.append('Email', this.userEmail);
      formData.append('FacebookProfileImgUrl', imageUrl);
      const response = await this.personalInfoService.updateProfileImage(
        formData
      );
      if (response) {
        const data = response.data;
        this.userImageUrl = data.profilePic;
        this.isImageAvailable = true;
        this.sharedService.updateHeaderImageUrl(this.userImageUrl);
      }
      // await this.localService.setLocalData(LocalConstant.USER_IMAGE, imageUrl);
    }
  }

  async editProfileImage(): Promise<void> {
    const data = await this.localService.getLocalData(LocalConstant.USER_DATA);
    this.userEmail = data.user_name ? data.user_name : data.email;
    const dialogRef = this.dialog.open(EditProfileImageComponent, {
      disableClose: true,
      data: {
        email: this.userEmail,
        image: this.isImageAvailable ? this.userImageUrl : '',
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((response: { isSuccess: boolean; result: any }) => {
        if (response && response.isSuccess) {
          const data = response.result.data;
          this.userImageUrl = data.profilePic;
          this.isImageAvailable = true;
          this.sharedService.updateHeaderImageUrl(this.userImageUrl);
        }
      });
  }

  onToggleSideMenu(isMenuOpen: boolean): void {
    this.isMenuOpen = isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  ngOnDestroy(): void {
    this.imagesubscription$?.unsubscribe();
  }
}
