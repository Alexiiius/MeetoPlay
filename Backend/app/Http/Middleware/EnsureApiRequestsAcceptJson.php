<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApiRequestsAcceptJson {


    
    public function handle(Request $request, Closure $next)
    {
        if ($request->is('api/*')) {
            
            // add header 'Accept: application/json' to the request
            //this is made to ensure a error json response in case of unauthorized access
            //laravel default response is html to login page after a unauthorized try without this header
            $request->headers->set('Accept', 'application/json');
        }
    
        return $next($request);
    }


}
