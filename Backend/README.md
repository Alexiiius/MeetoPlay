## Requirements

- PHP >= 8.3
- Node >= 20
- Composer
- MySQL >= 5.7

## Installation for local

- Install dependencies ``` npm install ``` and ``` composer install  ```
- Launch Sail (if needed) ``` ./vendor/bin/sail up  ```
- Launch vite ``` npm run dev ```
- Link Storage ``` php artisan storage:link  ```
- Launch Jobs queue ``` php artisan queue:work ```
- Launch WebSocket server ``` php artisan reverb:start --debug ```
- Launch Schedule ``` php artisan schedule:run  ```

## Usage

TODO

## Credits

[Alejandro Sánchez Fernández](https://github.com/Alexiiius).
[Daniel Ramírez Vaquero](https://github.com/DaniRamirezVaquero).

## Used Links/Info

- [Laravel Documentation](https://laravel.com/docs)
- [Email Verification](https://laravel.com/docs/11.x/verification)
- [Events](https://laravel.com/docs/11.x/events)
- [Error Handling](https://laravel.com/docs/11.x/errors)
- [Render Exceptios](https://laravel.com/docs/11.x/errors#renderable-exceptions)
- [Middleware](https://laravel.com/docs/11.x/middleware)
- [Unauthorized request JSON response](https://laracasts.com/discuss/channels/laravel/laravel-11-api-unauthorized-requests-redirects-to-login-page?page=1&replyId=930192)
- [Console Kernel](https://rezakhademix.medium.com/laravel-11-no-http-kernel-no-casts-no-console-kernel-721c62adb6ef)
- [Laravel Reverb](https://laravel.com/docs/11.x/reverb)
- [Laravel Pulse](https://laravel.com/docs/11.x/pulse)
- [Supervisor Config](https://laravel.com/docs/11.x/queues#supervisor-configuration)
- [L5 Swagger IO](https://github.com/DarkaOnLine/L5-Swagger?tab=readme-ov-file)
- [Websocket SSL Configuration issues](https://github.com/beyondcode/laravel-websockets/issues/1143)
- [Websocket Configuration issues](https://github.com/laravel/reverb/issues/177)
- [Laravel Reeverb Websocket issues](https://github.com/laravel/reverb/issues/107)
