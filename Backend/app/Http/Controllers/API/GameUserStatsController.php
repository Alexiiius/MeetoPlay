<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use App\Models\GameUserStats;
use App\Models\GamemodeStats;

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
                'timestamp' => now(),
            ],
        ], $code);
    }

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

        return $this->responseDataFormat($request, $dataToInsert, 'Game stats created successfully', 201);
    }

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

        $dataToUpdate = $request->all();
        $dataToUpdate['user_id'] = $user->id;

        if ($GameUserStats->update($dataToUpdate)) {
            return $this->responseDataFormat($request, $GameUserStats, 'Game stats updated successfully');
        }else{
            return $this->responseDataFormat($request, [], 'Game stats not updated');
        }

    }

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

        return $this->responseDataFormat($request, $dataToInsert, 'Gamemode stats created successfully', 201);
    }

    public function gamemodeUpdate($gamemodeStatID, Request $request){

        $request->validate([
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

        $dataToUpdate = $request->all();
        $dataToUpdate['user_id'] = $user->id;

        if ($GameMode->update($dataToUpdate)) {
            return $this->responseDataFormat($request, $GameMode, 'Game stats updated successfully');
        }else{
            return $this->responseDataFormat($request, [], 'Game stats not updated');
        }

    }

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
