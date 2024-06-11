<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Advises;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


/**
 * @OA\Tag(
 *     name="Advises",
 *     description="Endpoints for Advises"
 * )
 */
class AdvisesController extends Controller {
    



    /**
 * @OA\Post(
 *     path="/api/advises/create",
 *     tags={"Advises"},
 *     summary="Create a new advise. Only for ADMIN",
 *     operationId="createAdvise",
 *     @OA\RequestBody(
 *         description="Advise to add",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="title", type="string"),
 *             @OA\Property(property="description", type="string"),
 *             @OA\Property(property="time_start", type="string", format="date-time"),
 *             @OA\Property(property="time_end", type="string", format="date-time")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Advise created successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="title", type="string"),
 *                 @OA\Property(property="description", type="string"),
 *                 @OA\Property(property="time_start", type="string", format="date-time"),
 *                 @OA\Property(property="time_end", type="string", format="date-time"),
 *                 @OA\Property(property="created_at", type="string", format="date-time"),
 *                 @OA\Property(property="updated_at", type="string", format="date-time")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
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


    /**
 * @OA\Get(
 *     path="/api/advises/get",
 *     tags={"Advises"},
 *     summary="Get all active advises",
 *     operationId="getActualAdvises",
 *     @OA\Response(
 *         response=200,
 *         description="Active advises retrieved successfully",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="time_start", type="string", format="date-time"),
 *                 @OA\Property(property="time_end", type="string", format="date-time"),
 *                 @OA\Property(property="created_at", type="string", format="date-time"),
 *                 @OA\Property(property="updated_at", type="string", format="date-time")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function getActualAdvises(Request $request){
        $now = now();
        $advises = Advises::where('time_start', '<=', $now)
                          ->where('time_end', '>=', $now)
                          ->get();
        return response()->json($advises);
    }


}
