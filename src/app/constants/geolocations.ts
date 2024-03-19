export class GeoLocationData {
  public static markers = [
    {
      position: {
        lat: 24.45316834163965,
        lng: 54.638032437103476,
      },
      visible: true,
      opacity: 1,
      label: {
        color: ' ',
        text: ' ',
      },
      title: 'Drag to change location',
      options: {
        draggable: false,
        animation: google.maps.Animation.DROP,
      },
    },
  ];
  public static markersForSearch = [
    {
      position: {
        lat: 24.45316834163965,
        lng: 54.638032437103476,
      },
      visible: true,
      opacity: 1,
      label: {
        color: ' ',
        text: ' ',
      },
      title: 'Drag to change location',
      options: {
        draggable: false,
      },
    },
  ];

  public static center = {
    lat: 24.45316834163965,
    lng: 54.638032437103476,
  };

  public static marker = {
    position: {
      lat: 24.45316834163965,
      lng: 54.638032437103476,
    },
    label: {
      color: 'white',
      text: 'Paris',
    },
  };

  public static options = {
    position: {
      lat: 24.45316834163965,
      lng: 54.638032437103476,
    },
    visible: true,
    opacity: 1,
    label: {
      color: ' ',
      text: ' ',
    },
    title: 'Drag to change location',
    icon: 'https://giggster.com/images/become-host-steps/map-pin-green.png',
    options: {
      draggable: false,
      animation: google.maps.Animation.DROP,
    },
  };

  public static optionsForSearch = {
    position: {
      lat: 24.45316834163965,
      lng: 54.638032437103476,
    },
    visible: true,
    opacity: 1,
    label: {
      color: ' ',
      text: ' ',
    },
    title: 'Drag to change location',
    options: {
      draggable: false,
      animation: google.maps.Animation.DROP,
    },
  };
}
