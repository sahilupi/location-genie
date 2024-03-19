import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutsRoutingModule } from './layouts-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, LayoutComponent],
  imports: [CommonModule, LayoutsRoutingModule, SharedModule],
})
export class LayoutsModule {}
