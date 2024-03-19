import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
  Gallery,
} from 'ng-gallery';

@Component({
  selector: 'app-gallery-model',
  templateUrl: './gallery-model.component.html',
  styleUrls: ['./gallery-model.component.scss'],
})
export class GalleryModelComponent implements OnInit {
  @Input({ required: true }) images: string[];
  @Output() closeGallery = new EventEmitter<boolean>();

  items: GalleryItem[] = [];

  constructor(public gallery: Gallery) {}

  ngOnInit(): void {
    this.onLoadLightBox();
  }

  private onLoadLightBox(): void {
    this.items = this.images.map(
      (item) => new ImageItem({ src: item, thumb: item })
    );
    const lightboxRef = this.gallery.ref('lightbox');
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
    });

    lightboxRef.load(this.items);
  }

  onCloseGallery(): void {
    this.closeGallery.emit(false);
  }
}
