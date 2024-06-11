<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use App\Models\GameUserStats;
use App\Models\GamemodeStats;



/**
 * @OA\Tag(
 *     name="GameUserStats",
 *     description="Endpoints for User Stats in Games"
 * )
 */
class GameUserStatsController extends Controller {

    public function responseDataFormat(Request $request, $data, $message, $code = 200) {
        return response()->json([
            'data' => [
                'message' => $message,
                'GameUserStats' => $data,
                'Links' => [
                    'self' => url($request->path())
                ],
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ], $code);
    }

    public function responseDataFormat2(Request $request, $data, $message, $code = 200) {
        return response()->json([
            'data' => [
                'message' => $message,
                'GamemodeStats' => $data,
                'Links' => [
                    'self' => url($request->path())
                ],
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ], $code);
    }


    /**
 * @OA\Get(
 *     path="/api/user/game-stats/search/{id}",
 *     summary="Get game stats for a specific user",
 *     tags={"GameUserStats"},
 *     security={{"Bearer":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the user to get the game stats for",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Game stats retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Game stats retrieved successfully"),
 *                 @OA\Property(property="game_stats", type="array", 
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="id", type="integer", example=1),
 *                         @OA\Property(property="game_id", type="integer", example=1),
 *                         @OA\Property(property="user_id", type="integer", example=1),
 *                         @OA\Property(property="game_name", type="string", example="Game Name"),
 *                         @OA\Property(property="hours_played", type="integer", example=100),
 *                         @OA\Property(property="lv_account", type="integer", example=10),
 *                         @OA\Property(property="nickname_game", type="string", example="Nickname"),
 *                         @OA\Property(property="game_pic", type="string", example="game_pic.jpg"),
 *                         @OA\Property(property="gamemodeStats", type="array", 
 *                             @OA\Items(
 *                                 type="object",
 *                                 @OA\Property(property="id", type="integer", example=1),
 *                                 @OA\Property(property="game_user_stats_id", type="integer", example=1),
 *                                 @OA\Property(property="gamemode_name", type="string", example="Gamemode Name"),
 *                                 @OA\Property(property="gamemodes_rank", type="string", example="Rank")
 *                             )
 *                         )
 *                     )
 *                 ),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/game-stats/search/{id}")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="No game stats found",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="No game stats found.")
 *         )
 *     )
 * )
 */
    //return all game stats and gamemodes associated stats from a specific user id
    public function index($id, Request $request) {
        $data = GameUserStats::where('user_id', $id)
            ->select('id', 'game_id', 'user_id', 'game_name', 'hours_played', 'lv_account', 'nickname_game', 'game_pic')
            ->with(['gamemodeStats' => function($query) {
                $query->select('id', 'game_user_stats_id', 'gamemode_name', 'gamemodes_rank');
            }])
            ->get();

            if ($data->isEmpty()) {
                return $this->responseDataFormat($request, $data, 'No game stats found');
            }

        return $this->responseDataFormat($request, $data, 'Game stats retrieved successfully');
    }




    /**
 * @OA\Post(
 *     path="/api/user/game-stats/create",
 *     summary="Create game stats for the authenticated user",
 *     tags={"GameUserStats"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="Game stats to be created",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="game_id", type="integer", example=1),
 *             @OA\Property(property="game_name", type="string", example="Game Name"),
 *             @OA\Property(property="hours_played", type="integer", example=100),
 *             @OA\Property(property="lv_account", type="integer", example=10),
 *             @OA\Property(property="nickname_game", type="string", example="Nickname"),
 *             @OA\Property(property="game_pic", type="string", example="game_pic.jpg")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Game stats created successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Game stats created successfully"),
 *                 @OA\Property(property="game_id", type="integer", example=1),
 *                 @OA\Property(property="game_name", type="string", example="Game Name"),
 *                 @OA\Property(property="hours_played", type="integer", example=100),
 *                 @OA\Property(property="lv_account", type="integer", example=10),
 *                 @OA\Property(property="nickname_game", type="string", example="Nickname"),
 *                 @OA\Property(property="game_pic", type="string", example="game_pic.jpg"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/game-stats/create")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Game stats already exist",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game stats already exist.")
 *         )
 *     )
 * )
 */
    //create a new game stats
    public function store(Request $request) {
        $request->validate([
            'game_id' => 'required|int',
            'game_name' => 'required|string|max:20|min:2',
            'hours_played' => 'required|int',
            'lv_account' => 'required|int',
            'nickname_game' => 'required|string|max:20|min:2',
            'game_pic' => 'required|string'
        ]);

        $dataToInsert = $request->all();
        $dataToInsert['user_id'] = auth()->id();

        $exist = GameUserStats::where('game_id', $dataToInsert['game_id'])
            ->where('user_id', $dataToInsert['user_id'])
            ->get()
            ->first();

        if ($exist) {
            return $this->responseDataFormat($request, $exist, 'Game stats already exist', 409);
        }



        GameUserStats::create($dataToInsert);

        //Recolect gameStat inserted
        $createdGameStat = GameUserStats::where('game_id', $dataToInsert['game_id'])
            ->where('user_id', $dataToInsert['user_id'])
            ->get()
            ->first();

        return $this->responseDataFormat($request, $createdGameStat, 'Game stats created successfully', 201);
    }


    
    /**
 * @OA\Delete(
 *     path="/api/user/game-stats/delete/{gameStatID}",
 *     summary="Delete game stats for a specific user",
 *     tags={"GameUserStats"},
 *     security={{"Bearer":{}}},
 *     @OA\Parameter(
 *         name="gameStatID",
 *         in="path",
 *         description="ID of the game stats to be deleted",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Game stats deleted successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Game stats deleted successfully"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/game-stats/delete/{gameStatID}")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Game stats not found",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game stats not found.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Unauthorized.")
 *         )
 *     )
 * )
 */
    //destroy a specific game stats by game_id only if the user has permission to delete it
    public function destroy($gameStatID, Request $request){

        $user = auth()->user();

        $GameUserStats = GameUserStats::where('id', $gameStatID)->first();

        if (!$GameUserStats) {
            return $this->responseDataFormat($request, $GameUserStats, 'Game stats not found');
        }

        if ($GameUserStats->user_id != $user->id && $user->is_admin != true) {
            return $this->responseDataFormat($request, null, 'Unauthorized', 401);
        }

        if ($GameUserStats->delete()) {
            return $this->responseDataFormat($request, $GameUserStats, 'Game stats deleted successfully');
        }else{
            return $this->responseDataFormat($request, [], 'Game stats not deleted');
        }

    }


    /**
 * @OA\Put(
 *     path="/api/user/game-stats/update/{gameStatID}",
 *     summary="Update game stats for a specific user",
 *     tags={"GameUserStats"},
 *     security={{"Bearer":{}}},
 *     @OA\Parameter(
 *         name="gameStatID",
 *         in="path",
 *         description="ID of the game stats to be updated",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\RequestBody(
 *         description="Game stats to be updated",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="hours_played", type="integer", example=100),
 *             @OA\Property(property="lv_account", type="integer", example=10),
 *             @OA\Property(property="nickname_game", type="string", example="Nickname")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Game stats updated successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Game stats updated successfully"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/game-stats/update/{gameStatID}")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Game stats not found",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game stats not found.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Unauthorized.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Game stats already exist",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game stats already exist.")
 *         )
 *     )
 * )
 */
    //update a specific game stats by game_id only if the user has permission to update it
    public function update($gameStatID, Request $request){

        $request->validate([
            'hours_played' => 'required|int',
            'lv_account' => 'required|int',
            'nickname_game' => 'required|string|max:20|min:2',
        ]);

        $user = auth()->user();

        $GameUserStats = GameUserStats::where('id', $gameStatID)->first();

        if (!$GameUserStats) {
            return $this->responseDataFormat($request, $GameUserStats, 'Game stats not found');
        }

        if ($GameUserStats->user_id != $user->id && $user->is_admin != true) {
            return $this->responseDataFormat($request, null, 'Unauthorized', 401);
        }

        $gameUserStatsNameExist = GameUserStats::where('game_name', $request->game_name)
            ->where('user_id', $GameUserStats->user_id)
            ->get()
            ->first();

        if ($gameUserStatsNameExist && $gameUserStatsNameExist->game_name == $request->game_name ) {
            return $this->responseDataFormat($request, null, 'Game stats already exist', 409);
        }

        $dataToUpdate = $request->all();
        $dataToUpdate['user_id'] = $user->id;

        if ($GameUserStats->update($dataToUpdate)) {
            return $this->responseDataFormat($request, $GameUserStats, 'Game stats updated successfully');
        }else{
            return $this->responseDataFormat($request, [], 'Game stats not updated');
        }

    }


    /**
 * @OA\Post(
 *     path="/api/user/game-stats/gamemode/create",
 *     summary="Create game mode stats for a specific user",
 *     tags={"GameUserStats"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="Game mode stats to be created",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="game_user_stats_id", type="integer", example=1),
 *             @OA\Property(property="gamemode_name", type="string", example="Gamemode Name"),
 *             @OA\Property(property="gamemodes_rank", type="string", example="Rank")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Game mode stats created successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Game mode stats created successfully"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/game-stats/gamemode/create")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Game stats not found",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game stats not found.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Unauthorized.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Game mode stats already exist",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game mode stats already exist.")
 *         )
 *     )
 * )
 */
    public function gamemodeCreate(Request $request) {
        $request->validate([
            'game_user_stats_id' => 'required|int',
            'gamemode_name' => 'required|string|max:20|min:2',
            'gamemodes_rank' => 'required|string|max:20|min:1',
        ]);

        $dataToInsert = $request->all();
        $dataToInsert['user_id'] = auth()->id();

        $GameUserStats = GameUserStats::where('id', $dataToInsert['game_user_stats_id'])->first();

        //check if gamemode_name already exist inside $gameuserStats gamemodes relation
        if ($GameUserStats->gamemodeStats()->where('gamemode_name', $dataToInsert['gamemode_name'])->exists()) {
            return $this->responseDataFormat($request, null, 'Gamemode stats already exist', 409);
        }

        if (!$GameUserStats) {
            return $this->responseDataFormat($request, null, 'Game stats not found');
        }

        if ($GameUserStats->user_id != $dataToInsert['user_id']) {
            return $this->responseDataFormat($request, null, 'Unauthorized', 401);
        }

        $GameUserStats->gamemodeStats()->create($dataToInsert);

        //Recolect gamemodeStat inserted
        $createdGamemodeStat = $GameUserStats->gamemodeStats()->where('gamemode_name', $dataToInsert['gamemode_name'])->first();

        return $this->responseDataFormat2($request, $createdGamemodeStat, 'Gamemode stats created successfully', 201);
    }


    /**
 * @OA\Patch(
 *     path="/api/user/game-stats/gamemode/update/{gamemodeStatID}",
 *     summary="Update game mode stats for a specific user",
 *     tags={"GameUserStats"},
 *     security={{"Bearer":{}}},
 *     @OA\Parameter(
 *         name="gamemodeStatID",
 *         in="path",
 *         description="ID of the game mode stats to be updated",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\RequestBody(
 *         description="Game mode stats to be updated",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="gamemode_name", type="string", example="Gamemode Name"),
 *             @OA\Property(property="gamemodes_rank", type="string", example="Rank")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Game mode stats updated successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Game mode stats updated successfully"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/game-stats/gamemode/update/{gamemodeStatID}")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Game mode stats not found",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game mode stats not found.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Unauthorized.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Game mode stats already exist",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game mode stats already exist.")
 *         )
 *     )
 * )
 */
    public function gamemodeUpdate($gamemodeStatID, Request $request){

        $request->validate([
            'gamemode_name' => 'required|string|max:20|min:2',
            'gamemodes_rank' => 'required|string|max:20|min:1',
        ]);

        $user = auth()->user();

        $GameMode = GameModeStats::where('id', $gamemodeStatID)->first();

        if (!$GameMode) {
            return $this->responseDataFormat($request, $GameUserStats, 'Game stats not found');
        }

        if ($GameMode->user_id != $user->id && $user->is_admin != true) {
            return $this->responseDataFormat($request, null, 'Unauthorized', 401);
        }

        $Gamemode_NameExist = GameModeStats::where('gamemode_name', $request->gamemode_name)
            ->where('game_user_stats_id', $GameMode->game_user_stats_id)
            ->get()
            ->first();

        if ($Gamemode_NameExist && $Gamemode_NameExist->gamemodes_rank == $request->gamemodes_rank) {
            return $this->responseDataFormat($request, null, 'Gamemode name already exist', 409);
        }

        $dataToUpdate = $request->only('gamemode_name', 'gamemodes_rank');
        $dataToUpdate['user_id'] = $user->id;

        if ($GameMode->update($dataToUpdate)) {
            return $this->responseDataFormat2($request, $GameMode, 'Game stats updated successfully');
        }else{
            return $this->responseDataFormat($request, [], 'Game stats not updated');
        }

    }


    /**
 * @OA\Delete(
 *     path="/api/user/game-stats/gamemode/delete/{gamemodeStatID}",
 *     summary="Delete game mode stats for a specific user",
 *     tags={"GameUserStats"},
 *     security={{"Bearer":{}}},
 *     @OA\Parameter(
 *         name="gamemodeStatID",
 *         in="path",
 *         description="ID of the game mode stats to be deleted",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Game mode stats deleted successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Game mode stats deleted successfully"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/game-stats/gamemode/delete/{gamemodeStatID}")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Game mode stats not found",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Game mode stats not found.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Unauthorized.")
 *         )
 *     )
 * )
 */
    public function gamemodeDestroy($gamemodeStatID, Request $request){

        $user = auth()->user();

        $GameMode = GameModeStats::where('id', $gamemodeStatID)->first();

        if (!$GameMode) {
            return $this->responseDataFormat($request, $GameUserStats, 'Game stats not found');
        }

        if ($GameMode->user_id != $user->id && $user->is_admin != true) {
            return $this->responseDataFormat($request, null, 'Unauthorized', 401);
        }

        if ($GameMode->delete()) {
            return $this->responseDataFormat($request, $GameMode, 'Game stats deleted successfully');
        }else{
            return $this->responseDataFormat($request, [], 'Game stats not deleted');
        }

    }


}
