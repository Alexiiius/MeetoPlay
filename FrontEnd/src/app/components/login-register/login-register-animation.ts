// login-registro-animation.ts
import { trigger, state, style, transition, animate } from '@angular/animations';

export const loginAnimation =
    trigger('loginAnimation', [
        state('login', style({
            top: '24px',
            bottom: '24px',
            left: '24px',
            zIndex: 2
        })),
        state('register', style({
            top: '24px',
            bottom: '24px',
            right: '24px',
            zIndex: 0
        })),
        transition('login <=> register', [
            animate('0.5s ease-in-out')
        ])
    ]);

export const registerAnimation =
    trigger('registerAnimation', [
        state('login', style({
            top: '24px',
            bottom: '24px',
            right: '24px',
            zIndex: 0
        })),
        state('register', style({
            top: '24px',
            bottom: '24px',
            left: '24px',
            zIndex: 2
        })),
        transition('login <=> register', [
            animate('0.5s ease-in-out')
        ])
    ]);
