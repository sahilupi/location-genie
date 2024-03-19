import { OwlOptions } from 'ngx-owl-carousel-o';

export class NgxCarousalOptions {
  public static spaceCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 30,
    navSpeed: 400,
    autoplay: false,
    autoplayTimeout: 2000,
    autoplaySpeed: 500,
    nav: true,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      480: {
        items: 2,
      },
      600: {
        items: 3,
      },
      768: {
        items: 3,
      },
      992: {
        items: 5,
      },
      1200: {
        items: 5,
      },
      1500: {
        items: 6,
      },
    },
  };

  public static popularLocationCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 30,
    navSpeed: 400,
    autoplay: false,
    autoplayTimeout: 2000,
    autoplaySpeed: 500,
    nav: true,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      480: {
        items: 1,
      },
      600: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 1,
      },
      1200: {
        items: 1,
      },
      1500: {
        items: 1,
      },
    },
  };

  public static eventBoxCustomOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 0,
    navSpeed: 400,
    autoplay: false,
    autoplayTimeout: 2000,
    autoplaySpeed: 500,
    nav: false,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 4,
      },
      480: {
        items: 6,
      },
    },
  };

  public static similarLocationsOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    margin: 30,
    navSpeed: 400,
    autoplay: false,
    autoplayTimeout: 2000,
    autoplaySpeed: 500,
    nav: true,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      480: {
        items: 2,
      },
      600: {
        items: 2,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 3,
      },
      1500: {
        items: 3,
      },
    },
  };

  public static blogCustomOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 30,
    navSpeed: 400,
    autoplay: false,
    autoplayTimeout: 2000,
    autoplaySpeed: 500,
    nav: true,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      480: {
        items: 2,
      },
      600: {
        items: 3,
      },
      768: {
        items: 3,
      },
      992: {
        items: 5,
      },
      1200: {
        items: 5,
      },
      1500: {
        items: 6,
      },
    },
  };

}
