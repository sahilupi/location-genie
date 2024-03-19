import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
})
export class ChatLayoutComponent implements OnInit, OnDestroy {
  isAdminUrl = false;
  routerSubscription: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isAdminUrl = this.router.url.includes('admin');
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd || event instanceof NavigationCancel
        )
      )
      .subscribe((event) => {
        if (!(event instanceof NavigationEnd)) {
          return;
        }
        if (event.url.includes('admin')) {
          this.isAdminUrl = true;
        } else {
          this.isAdminUrl = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
