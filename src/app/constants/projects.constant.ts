import { Project } from '../models/project.model';

export class Projects {
  public static projects: Project[] = [
    {
      id: 1,
      imageUrl: 'assets/images/dummy/default_image.png',
      title: 'Project 1',
      startDate: '09-14-2023',
      endDate: '09-18-2023',
      privacy: 'Private',
      isPublic: false,
      description:
        'We can help you find off-market locations, pull permits and negotiate the best rates, at no cost',
      listingIds: [],
    },
    {
      id: 2,
      listingIds: [],
      imageUrl: 'assets/images/dummy/default_image.png',
      title: 'Project 2',
      startDate: '09-14-2023',
      endDate: '09-18-2023',
      privacy: 'Private',
      isPublic: false,
      description:
        'We can help you find off-market locations, pull permits and negotiate the best rates, at no cost',
    },
    {
      id: 3,
      listingIds: [],
      imageUrl: 'assets/images/dummy/default_image.png',
      title: 'Project 3',
      startDate: '09-14-2023',
      endDate: '09-18-2023',
      privacy: 'Private',
      isPublic: false,
      description:
        'We can help you find off-market locations, pull permits and negotiate the best rates, at no cost',
    },
  ];

  public static projectLocationStatus = {
    1: 'Needs Review',
    2: 'Scouted',
    3: 'Contacted',
    4: 'Booked',
  };

  public static projectLocationStatusColors = {
    1: '#ffa616',
    2: '#4a90e2',
    3: '#c25aa7',
    4: '#016670',
  };
}
