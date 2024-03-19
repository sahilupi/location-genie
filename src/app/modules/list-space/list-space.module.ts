import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListSpaceRoutingModule } from './list-space-routing.module';
import { LastStepComponent } from './last-step/last-step.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListSpaceWrapperComponent } from './list-space-wrapper/list-space-wrapper.component';
import { ListSpaceHeaderComponent } from '../../shared/components/list-space-header/list-space-header.component';

@NgModule({
  declarations: [LastStepComponent, ListSpaceWrapperComponent],
  imports: [CommonModule, ListSpaceRoutingModule, SharedModule],
})
export class ListSpaceModule {}
