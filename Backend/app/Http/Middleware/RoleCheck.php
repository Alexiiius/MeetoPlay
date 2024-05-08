<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck {


    public function handle(Request $request, Closure $next): Response {

        //pass if the user is an admin
        if ($request->user()->is_admin == 0) {
            return response()->json(['message' => 'Unauthorized not admin'], 401);
        }

        return $next($request);
    }


}
