<?php

namespace App\Http\Controllers;

use App\Data\Rating\RatingData;
use App\Http\Requests\Rating\CreateRatingRequest;
use App\Http\Requests\Rating\GetRatingsRequest;
use App\Http\Requests\Rating\UpdateRatingRequest;
use App\Http\Resources\Rating\RatingResource;
use App\Models\Product;
use App\Models\Rating;
use App\Models\User;
use App\Services\Rating\RatingService;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Validator;

class RatingController extends Controller
{
    private RatingService $ratingService;

    public function __construct(RatingService $ratingService)
    {
        $this->ratingService = $ratingService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param GetRatingsRequest $request
     * @return JsonResponse
     */
    public function index(GetRatingsRequest $request)
    {
        try {
            $ratings = $this->ratingService->getAll();
        } catch (QueryException $e) {
            return response()->json([
                "ratings" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "ratings" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "ratings" => RatingResource::collection($ratings),
            "message" => "Ratings found.",
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateRatingRequest $request
     * @return JsonResponse
     */
    public function store(CreateRatingRequest $request)
    {
        try {
            $rating = $this->ratingService->create(RatingData::fromRequest($request));
        } catch (QueryException $e) {
            return response()->json([
                "rating" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "rating" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "rating" => new RatingResource($rating),
            "message" => "Rating created.",
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  GetRatingsRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(GetRatingsRequest $request, int $id)
    {
        try {
            $rating = $this->ratingService->getById($id);
        } catch (QueryException $e) {
            return response()->json([
                "rating" => null,
                "message" => "Server Error",
            ], 500);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "rating" => null,
                "message" => "rating not found",
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "rating" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "rating" =>  new RatingResource($rating),
            "message" => "Rating found",
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateRatingRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(UpdateRatingRequest $request, $id)
    {
        try {
            $rating = $this->ratingService->update(RatingData::fromRequest($request), $request->ratingM);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "rating" => null,
                "message" => "Rating not found.",
            ], 404);
        }

        return response([
            "rating" => new RatingResource($rating),
            "message" => "Rating updated.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    // public function destroy($id) {
    //   $rating = Rating::find($id);
    //   $rating->delete();

    //   return response([
    //     "rating" => $rating,
    //     "message" => "Rating deleted.",
    //   ], 200);
    // }
}
