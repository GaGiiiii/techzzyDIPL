<?php

namespace App\Http\Controllers;

use App\Data\Comment\CommentData;
use App\Http\Requests\Comment\CreateCommentRequest;
use App\Http\Requests\Comment\DeleteCommentRequest;
use App\Http\Requests\Comment\GetCommentsRequest;
use App\Http\Requests\Comment\UpdateCommentRequest;
use App\Http\Resources\Comment\CommentResource;
use App\Services\Comment\CommentService;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{

    private CommentService $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param GetCommentsRequest $request
     * @return JsonResponse
     */
    public function index(GetCommentsRequest $request)
    {
        try {
            $comments = $this->commentService->getAll();
        } catch (QueryException $e) {
            return response()->json([
                "comments" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "comments" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "comments" => CommentResource::collection($comments),
            "message" => "Comments found.",
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateCommentRequest $request
     * @return JsonResponse
     */
    public function store(CreateCommentRequest $request)
    {
        try {
            $comment = $this->commentService->create(CommentData::fromRequest($request));
        } catch (QueryException $e) {
            return response()->json([
                "comment" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "comment" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "comment" => new CommentResource($comment),
            "message" => "Comment created.",
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  GetCommentsRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(GetCommentsRequest $request, int $id)
    {
        try {
            $comment = $this->commentService->getById($id);
        } catch (QueryException $e) {
            return response()->json([
                "comment" => null,
                "message" => "Server Error",
            ], 500);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "comment" => null,
                "message" => "comment not found",
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "comment" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "comment" =>  new CommentResource($comment),
            "message" => "Comment found",
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateCommentRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(UpdateCommentRequest $request, $id)
    {
        try {
            $comment = $this->commentService->update(CommentData::fromRequest($request), $request->comment);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "comment" => null,
                "message" => "comment not found.",
            ], 404);
        }

        return response([
            "comment" => new CommentResource($comment),
            "message" => "Comment updated.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  DeleteCommentRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy(DeleteCommentRequest $request, int $id)
    {
        try {
            $comment = $this->commentService->delete($request->comment);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "comment" => null,
                "message" => "comment not found.",
            ], 404);
        }

        return response([
            "comment" => new CommentResource($comment),
            "message" => "Comment deleted.",
        ], 200);
    }
}
