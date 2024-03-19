import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRootComponent } from './home-root/home-root.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';



@NgModule({
  declarations: [
    HomeRootComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
