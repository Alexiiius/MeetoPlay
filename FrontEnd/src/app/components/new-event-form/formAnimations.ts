import { animate, style, transition, trigger } from "@angular/animations";

export const fadeAnimation =
trigger('routeAnimations', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('0.7s', style({ opacity: 1 })),
  ]),
]);
