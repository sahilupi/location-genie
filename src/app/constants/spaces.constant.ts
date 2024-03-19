import { SpaceCategoryModel } from '../models/home-edit.model';
import { Types } from './types.constant';

export class Spaces {
  public static sourceSpaceTitle = {
    categoryId: null,
    type: Types.SOURCE_SPACE_TITLE,
    typeName: 'SOURCE CREATIVE SPACES',
  };
  public static discoverEventTitle = {
    categoryId: null,
    type: Types.DISCOVER_EVENT_TITLE,
    typeName: 'DISCOVER WORK EVENT VENUES',
  };
  public static partyVenueTitle = {
    categoryId: null,
    type: Types.PARTY_VENUE_TITLE,
    typeName: 'FIND PARTY VENUES',
  };
  public static popularLocationTitle = {
    categoryId: null,
    type: Types.POPULAR_LOCATION_TITLE,
    typeName: 'OUR MOST POPULAR LOCATIONS',
  };
  public static popularLocationSubTitle = {
    categoryId: null,
    type: Types.POPULAR_LOCATION_SUB_TITLE,
    typeName:
      'A diverse selection of properties from our most experienced hosts',
    max: 120,
    header: 'Edit Sub Title',
  };
  public static spaces: SpaceCategoryModel[] = [
    {
      id: 1,
      position: 1,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/1899388.webp',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 2,
      position: 2,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/2784401.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 3,
      position: 3,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/3947177.webp',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 4,
      position: 4,
      text: 'Performance spaces',
      imageUrl:
        'assets/images/dummy/Real-Estate-Wallpaper-32-1920x1080-1-1536x864.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 5,
      position: 5,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/wp4110653.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 6,
      position: 6,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 7,
      position: 7,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 8,
      position: 8,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 10,
      position: 10,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
  ];
  public static workSpaces: SpaceCategoryModel[] = [
    {
      id: 1,
      position: 1,
      text: 'Performance 2 spaces',
      imageUrl: 'assets/images/dummy/3947177.webp',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 2,
      position: 2,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/real-estate-10.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 3,
      position: 3,
      text: 'Performance spaces',
      imageUrl:
        'assets/images/dummy/Real-Estate-Wallpaper-32-1920x1080-1-1536x864.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 4,
      position: 4,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/2784401.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 5,
      position: 5,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/wp4110657.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 6,
      position: 6,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 7,
      position: 7,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 8,
      position: 8,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 10,
      position: 10,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
  ];
  public static partySpaces: SpaceCategoryModel[] = [
    {
      id: 1,
      position: 1,
      text: 'Performance 3 spaces',
      imageUrl: 'assets/images/dummy/2784401.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 2,
      position: 2,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/real-estate-10.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 3,
      position: 3,
      text: 'Performance spaces',
      imageUrl:
        'assets/images/dummy/Real-Estate-Wallpaper-32-1920x1080-1-1536x864.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 4,
      position: 4,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/wp4110653.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 5,
      position: 5,
      text: 'Performance spaces',
      imageUrl: 'assets/images/dummy/wp4110657.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 6,
      position: 6,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 7,
      position: 7,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 8,
      position: 8,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
    {
      id: 10,
      position: 10,
      text: 'Performance spaces',
      imageUrl:
        'https://static.giggster.com/media/hp/popular-activities/production/influencer.jpg',

      linkText: 'performance',
      link: '/performance',
      type: 'HomeSpace',
      typeName: 'Home',
    },
  ];

  public static dummySpace = {
    id: null,
    position: null,
    text: '',
    imageUrl: 'assets/images/dummy/default_image.png',

    linkText: '',
    link: '/',
    type: '',
    typeName: '',
    header: '',
    subHeader: '',
  };
  public static dummySpaces = [
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
    {
      id: null,
      position: null,
      text: '',
      imageUrl: 'assets/images/dummy/default_image.png',

      linkText: '',
      link: '/',
      type: '',
      typeName: '',
      header: '',
      subHeader: '',
    },
  ];
}
