import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
//     wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: [ 'ws', 'wss'],
// });


// window.Echo.channel(`public`).listen('GlobalMessage', (e) => {
//     console.log("From public channel");
//     console.log(e);
// });

// window.Echo.private(`App.Models.User.4`).listen('GotMessage', (e) => {
//     console.log("From private channel");
//     console.log(e);
// });
