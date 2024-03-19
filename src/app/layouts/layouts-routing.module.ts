import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { BecomeHostComponent } from '../components/become-host/become-host.component';
import { ReferralComponent } from '../components/referral/referral.component';
import { HelpPageComponent } from '../components/help-page/help-page.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { authGuard } from '../guards/auth.guard';
import { AboutComponent } from '../components/about/about.component';
import { GeneralComponent } from '../components/general/general.component';
import { AllCollectionComponent } from '../components/all-collection/all-collection.component';
import { LocationGenieWorkComponent } from '../components/location-genie-work/location-genie-work.component';
import { DriveBookingsComponent } from '../components/drive-bookings/drive-bookings.component';
import { EmailVerificationComponent } from '../components/email-verification/email-verification.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { adminAuthGuard } from '../guards/admin-auth.guard';
import { TermsComponent } from '../components/terms/terms.component';
import { PrivacyComponent } from '../components/privacy/privacy.component';
import { BookingFlowComponent } from '../components/booking-flow/booking-flow.component';
import { RefundPolicyComponent } from '../components/refund-policy/refund-policy.component';
import { PingComponent } from '../components/ping/ping.component';
import { BlogComponent } from '../components/blog/blog.component';
import { GuidesComponent } from '../components/guides/guides.component';
import { ConciergeComponent } from '../components/concierge/concierge.component';
import { CareersComponent } from '../components/careers/careers.component';
import { CommunityComponent } from '../components/community/community.component';
import { GuidelinesComponent } from '../components/guidelines/guidelines.component';
import { ResourceCenterComponent } from '../components/resource-center/resource-center.component';
import { TrustAndSafetyComponent } from '../components/trust-and-safety/trust-and-safety.component';
import { BookEventsComponent } from '../shared/components/book-events/book-events.component';
import { TellUsPageComponent } from '../shared/components/tell-us-page/tell-us-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'listing',
        loadChildren: () =>
          import('../modules/listing/listing.module').then(
            (m) => m.ListingModule
          ),
      },
      {
        path: 'bookings',
        loadChildren: () =>
          import('../modules/bookings/bookings.module').then(
            (m) => m.BookingsModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'my-listings',
        loadChildren: () =>
          import('../modules/host-listing/host-listing.module').then(
            (m) => m.HostListingModule
          ),

        canActivate: [authGuard],
      },
      {
        path: 'search',
        loadChildren: () =>
          import('../modules/search/search.module').then((m) => m.SearchModule),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('../modules/projects/projects.module').then(
            (m) => m.ProjectsModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'become-a-host',
        loadChildren: () =>
          import('../modules/list-space/list-space.module').then(
            (m) => m.ListSpaceModule
          ),
        // canActivate: [authGuard],
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../modules/account/account.module').then(
            (m) => m.AccountModule
          ),
        canLoad: [authGuard],
      },
      {
        path: 'tutorial',
        loadChildren: () =>
          import('../modules/hosting-guide/hosting-guide.module').then(
            (m) => m.HostingGuideModule
          ),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('../auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('../modules/chat/chat.module').then((m) => m.ChatModule),
        canActivate: [authGuard],
      },
      {
        path: 'book',
        loadChildren: () =>
          import('../modules/activity-search/activity-search.module').then(
            (m) => m.ActivitySearchModule
          ),
      },
      {
        path: 'landing-owner',
        component: BecomeHostComponent,
      },

      {
        path: 'landing-owner/edit',
        component: BecomeHostComponent,
        canActivate: [adminAuthGuard],
      },
      {
        path: 'referral',
        component: ReferralComponent,
      },
      {
        path: 'help-page',
        component: HelpPageComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'blog',
        component: BlogComponent,
      },
      {
        path: 'guides',
        component: GuidesComponent,
      },
      {
        path: 'concierge',
        component: ConciergeComponent,
      },
      {
        path: 'careers',
        component: CareersComponent,
      },
      {
        path: 'community',
        component: CommunityComponent,
      },
      {
        path: 'guidelines',
        component: GuidelinesComponent,
      },
      {
        path: 'resource-center',
        component: ResourceCenterComponent,
      },
      {
        path: 'trust-and-safety',
        component: TrustAndSafetyComponent,
      },
      {
        path: 'book-location/:type',
        component: BookEventsComponent,
      },
      {
        path: 'location-request',
        component: TellUsPageComponent,
      },
      {
        path: 'general',
        component: GeneralComponent,
      },
      {
        path: 'all-collection',
        component: AllCollectionComponent,
      },
      {
        path: 'location-genie-work',
        component: LocationGenieWorkComponent,
      },
      {
        path: 'drive-bookings',
        component: DriveBookingsComponent,
      },
      {
        path: 'email-verified',
        component: EmailVerificationComponent,
      },
      {
        path: 'terms',
        component: TermsComponent,
      },
      {
        path: 'privacy',
        component: PrivacyComponent,
      },
      {
        path: 'landing-owner-first-publish',
        component: BookingFlowComponent,
      },
      {
        path: 'cancellation-and-refund-policy',
        component: RefundPolicyComponent,
      },

      {
        path: 'ping',
        component: PingComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsRoutingModule { }
