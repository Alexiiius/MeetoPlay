<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Illuminate\Auth\AuthenticationException;

//manage group and global middleware here.
//to add at top or botton of 'web' middleware stack use prepend or append
//to add at top or botton of all middleware stack use preprendGlobal or appendGlobal
//to create an alias for a middleware use alias

//you can even create a new group, append or append to a existing group or remove and replace inside a group!
//give me kernel.php back again... please!

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            App\Http\Middleware\EnsureApiRequestsAcceptJson::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
       //
       $exceptions->render(function (AuthenticationException $e) {
        return response()->json([
            'data' => [
                'message' => 'Unauthorized access',
                'errors' => $e->getMessage(),
                'Links' => [
                    'self' => url('/api/register'),
                    'login' => url('/api/login'),
                    'logout' => url('/api/logout'),
                ],
            ],
            'meta' => [
                'timestamp' => now(),
            ],
        ], 401);
    });
      
    })->create();
