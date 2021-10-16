<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Product;
use Illuminate\Http\Request;
use Validator;

class CommentController extends Controller {
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index() {
    $comments = Comment::all();

    return response([
      "comments" => $comments,
      "message" => "Comments found",
    ], 200);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request) {
    if (auth()->user()->id !== $request->user_id) {
      return response([
        "comment" => null,
        "message" => "Unauthorized.",
      ], 401);
    }

    $product = Product::find($request->product_id);

    if (!$product) {
      return response([
        'comment' => null,
        'message' => 'Product not found.',
      ], 400);
    }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'body' => 'required|min:20',
    ]);

    if ($validator->fails()) {
      return response([
        'comment' => null,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $comment = new Comment;

    $comment->body = $request->body;
    $comment->user_id = $request->user_id;
    $comment->product_id = $request->product_id;

    $comment->save();
    $comment = $comment->fresh('user');

    return response([
      "comment" => $comment,
      "message" => "Comment created.",
    ], 201);
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id) {
    $comment = Comment::find($id);

    if (!$comment) {
      return response([
        'comment' => null,
        'message' => 'Comment not found.',
      ], 404);
    }

    return response([
      "comment" => $comment,
      "message" => "Comment found",
    ], 200);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $id) {
    $comment = Comment::find($id);

    if (!$comment) {
      return response([
        'comment' => null,
        'message' => 'Comment not found.',
      ], 404);
    }

    if (auth()->user()->cannot('update', $comment)) {
      return response([
        "comment" => $comment,
        "message" => "Unauthorized.",
      ], 401);
    }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'body' => 'required|min:20',
    ]);

    if ($validator->fails()) {
      return response([
        'comment' => $comment,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $comment->body = $request->body;
    $comment->save();

    return response([
      "comment" => $comment,
      "message" => "Comment updated.",
    ], 200);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id) {
    $comment = Comment::find($id);

    if (auth()->user()->cannot('forceDelete', $comment)) {
      return response([
        "comment" => $comment,
        "message" => "Unauthorized.",
      ], 401);
    }

    $comment->delete();

    return response([
      "comment" => $comment,
      "message" => "Comment deleted.",
    ], 200);
  }
}
