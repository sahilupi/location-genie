import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  isStickyHeader = false;
  showFooter = true;
  stickyHeaderSub$: Subscription;
  hideHeader = false;
  hideHeaderSub$: Subscription;

  constructor(private sharedService: SharedService, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      // @ts-ignore
      .subscribe((event: Router) => {
        this.showFooter =
          event.url.includes('become-a-host') || event.url.includes('messages')
            ? false
            : true;
      });
  }

  ngAfterViewInit(): void {
    this.stickyHeaderSub$ = this.sharedService
      .getStickyHeader()
      .subscribe((data: boolean) => {
        this.isStickyHeader = data;
      });

    this.hideHeaderSub$ = this.sharedService
      .getHideHeader()
      .subscribe((data: boolean) => {
        this.hideHeader = data;
      });
  }

  ngOnDestroy(): void {
    this.stickyHeaderSub$?.unsubscribe();
    this.hideHeaderSub$?.unsubscribe();
  }
}
