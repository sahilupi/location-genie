import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { ProjectService } from './services/project.service';
import { SharedService } from './services/shared.service';
import { SignalrClientService } from './services/signalr-client.service';
import { LocalService } from './services/local.service';
import { LocalConstant } from './constants/local-constant';
import { SpinnerService } from './services/spinner.service';
import { ChatUser } from './models/chat.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  currentUserId: string;
  recieverId: string;
  currentUserSub$: Subscription;
  userList: ChatUser[];
  signalSub$: Subscription;
  spinnerSub$: Subscription;
  isLoading = false;
  removeOverflow: boolean;
  
  @HostListener('window:beforeunload', ['$event'])
  async beforeunloadHandler() {
    if (this._signalrClientService.connection) {
      await this.signalService.revokeConnection(this.currentUserId);
      return false;
    }
    return false;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private projectSerive: ProjectService,
    private signalService: SignalrClientService,
    private localService: LocalService,
    private _signalrClientService: SignalrClientService,
    private sharedService: SharedService,
    private spinner: SpinnerService
  ) {
    // this.signalSub$ = new Subscription();
    // this.currentUserSub$ = this.signalService.emitCurrentUserId.subscribe(
    //   (currentUserId) => {
    //     this.currentUserId = currentUserId;
    //   }
    // );
    // this.signalSub$.add(
    //   this._signalrClientService.messenger.subscribe(async (res) => {
    //     if (res && this.signalService.areNotificationsGlobal) {
    //       const userFound = this.userList.find(
    //         (user) => user.userId === res.senderId
    //       );
    //       if (userFound) {
    //         this.snackbar.info(
    //           `${LocalConstant.MESSAGE_RECIEVED} from ${
    //             userFound.firstName ? userFound.firstName : userFound.email
    //           } ${userFound.lastName ? userFound.lastName : ''}`
    //         );
    //       } else {
    //         this.snackbar.info(LocalConstant.MESSAGE_RECIEVED);
    //       }
    //     }
    //   })
    // );
    // this.signalSub$.add(
    //   this._signalrClientService.users.subscribe(
    //     // @ts-ignore
    //     async (res: { data: ChatUser[] }) => {
    //       if (res) {
    //         this.userList = res.data;
    //       }
    //     }
    //   )
    // );

    this.spinnerSub$ = this.spinner.getSpinner().subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  async ngOnInit(): Promise<void> {
    if (await this.authService.isUserLoggedIn()) {
      const response =
        await this.projectSerive.getAllSelectedProjectLocations();
      if (
        response &&
        response.success &&
        response.data &&
        response.data.listingId
      ) {
        this.projectSerive.selectedProjectListings = response.data.listingId;
        this.sharedService.setSelectedProjectListings(response.data.listingId);
      }
      // if (!this._signalrClientService.connection) {
      //   await this.getCurrentUser();
      //   await this._signalrClientService.getContactList(this.currentUserId);
      // }
    }
    this.callRootFunctions();
  }

  callRootFunctions(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => {
          this.removeOverflow = this.router.url.includes('messages')
            ? true
            : false;
          return (
            event instanceof NavigationEnd || event instanceof NavigationCancel
          );
        })
      )
      .subscribe((event) => {
        if (!(event instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
  }

  private async getCurrentUser(): Promise<void> {
    const userData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
    this.currentUserId = userPayload.sub;
    this._signalrClientService.emitCurrentUserId.next(this.currentUserId);
    this._signalrClientService.currentUserId = this.currentUserId;
    this._signalrClientService.currentUserEmail = userPayload.email;
    await this._signalrClientService.openConnection();
    this._signalrClientService.chatMessageHandler();
  }

  async ngOnDestroy(): Promise<void> {
    this.routerSubscription?.unsubscribe();
    this.currentUserSub$?.unsubscribe();
    this.signalSub$?.unsubscribe();
    this.spinnerSub$?.unsubscribe();
  }
}
