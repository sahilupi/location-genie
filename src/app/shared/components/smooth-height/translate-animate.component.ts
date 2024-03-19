import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

export const translateAnimation = trigger('translateAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        stagger(100, [
          animate(
            '200ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);
