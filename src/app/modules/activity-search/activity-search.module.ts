import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitySearchRoutingModule } from './activity-search-routing.module';
import { ActivitySearchPageComponent } from './activity-search-page/activity-search-page.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ActivitySearchPageComponent],
  imports: [CommonModule, ActivitySearchRoutingModule, SharedModule],
})
export class ActivitySearchModule {}
