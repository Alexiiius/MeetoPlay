<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminOnlyWeb {


    public function handle(Request $request, Closure $next): Response {

        //pass if the user is an admin for web routes
        if ($request->user()->is_admin == 0) {

            //logout the user if they are not an admin
            $request->session()->invalidate();
            //redirect to login page with error message
            return redirect('/login')->with('error', 'You are not authorized to access this page');
        }
        return $next($request);
    }


}
