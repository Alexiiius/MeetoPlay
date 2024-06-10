<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Advises;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdvisesController extends Controller {
    

    public function createAdvise(Request $request){

        if ($request->user()->is_admin != true) {
            return response()->json(['error' => 'You are not authorized to create an advise'], 403);
        }

        Request()->validate([
            'title' => 'required|string|max:50',
            'description' => 'required|string|max:150',
            'time_start' => 'required|date',
            'time_end' => 'required|date',
        ]);

        Advises::create([
            'title' => $request->title,
            'description' => $request->description,
            'time_start' => $request->time_start,
            'time_end' => $request->time_end,
        ]);

    }

    public function getActualAdvises(Request $request){
        $now = now();
        $advises = Advises::where('time_start', '<=', $now)
                          ->where('time_end', '>=', $now)
                          ->get();
        return response()->json($advises);
    }


}
