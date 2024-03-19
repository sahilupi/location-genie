import { Component, Input, NgModule } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxCarousalOptions } from 'src/app/constants/ngx-carousal-options';
import { SpaceCategoryModel } from 'src/app/models/home-edit.model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  imports: [
    CarouselModule
  ]
})
export class BlogComponent {

  @Input({ required: true }) spaces: SpaceCategoryModel[] = [];
  customOptions: OwlOptions = NgxCarousalOptions.blogCustomOptions;

}
