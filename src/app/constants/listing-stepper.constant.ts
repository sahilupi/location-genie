import { ListingStepper } from '../models/listing-stepper.model';

export class ListingStepperConstant {
  public static stepOne: ListingStepper[] = [
    {
      title: 'Location Address',
      des: 'Your location address will not be displayed publicly. The exact location of your location will only be shared with the production team once you confirm the booking.',
    },
    {
      title: 'Location/map',
      des: 'If needed, you can adjust the map so the pin is in the right location. Only confirmed guests will see this, so they know how to get to your place.',
    },
    {
      title: 'Location Type',
      des: 'If your location is associated with more than one category, please select the one that fits best. When choosing a type, please select up to two types only.',
    },
    {
      title: 'Location detail/Parking',
      des: 'If your location is associated with more than one category, please select the one that fits best. When choosing a type, please select up to two types only.',
    },
  ];

  public static stepTwo: ListingStepper[] = [
    {
      title: 'Location Style',
      des: 'Production teams often search and filter by style. Including the right style can help connect you with the right bookings.',
    },
    {
      title: 'Location Features',
      des: 'The features you select will allow production teams to easily search for and find spaces with the features they’re looking for.',
    },
    {
      title: 'Interior',
      des: 'If your location is associated with more than one category, please select the one that fits best. When choosing a type.',
    },
    {
      title: 'Listing Title',
      des: "Call out what makes your space unique.Stick to simple language that's warm, inviting, and descriptive.",
    },
    {
      title: 'Listing stand out',
      des: 'Make sure to highlight amenities/features booking organizers will enjoy. Let in as much natural light as possible by opening blinds.',
    },
  ];

  public static stepThree: ListingStepper[] = [
    {
      title: 'Location Crew/opening hours',
      des: 'Set your opening hours to let guests know what times your location is open to host bookings (i.e. your general availability).',
    },
    {
      title: 'Availability Calendar',
      des: 'Production teams will see your availability and will request to book events only when your space is free. Make sure this is accurate to avoid miscommunications.',
    },
    {
      title: 'Host activities',
      des: "You can choose how guests will use your location. Selecting multiple uses will improve your space's visibility on search.",
    },
    {
      title: 'Location Price',
      des: "Your base rate can be negotiable. During the booking process, you'll have the opportunity to send a customized quote to anyone who wants to book your space.",
    },
    {
      title: 'Activites Details',
      des: "You can choose how guests will use your location. Selecting multiple uses will improve your space's visibility on search.",
    },
    {
      title: 'About you',
      des: 'Providing more information about yourself builds trust between hosts and guests to help streamline the booking process.',
    },
  ];
}
