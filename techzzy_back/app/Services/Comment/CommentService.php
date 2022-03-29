<?php

namespace App\Services\Comment;

use App\Data\Comment\CommentData;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class CommentService
{

    /**
     * Retrieves all the categories.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return Comment::all();
    }

    /**
     * Retrieves single Comment.
     *
     * @param int $id
     * @return Comment
     * @throws ModelNotFoundException
     */
    public function getById(int $id): ?Comment
    {
        return Comment::findOrFail($id);
    }

    /**
     * Creates a new Comment.
     *
     * @param CommentData $commentData
     * @return Comment
     */
    public function create(CommentData $commentData): Comment
    {
        $comment = new Comment();
        $comment = $comment->create($commentData->toArray());
        $comment = $comment->fresh(['user']);

        return $comment;
    }

    /**
     * Updates a existing Comment.
     *
     * @param CommentData $commentData
     * @param Comment|null $comment
     * @return Comment
     * @throws ModelNotFoundException
     */
    public function update(CommentData $commentData, ?Comment $comment): Comment
    {
        if ($comment === null) {
            throw new ModelNotFoundException();
        }

        $comment->update($commentData->toArray());

        return $comment;
    }

    /**
     * Deletes a existing Comment.
     *
     * @param Comment $comment
     * @return Comment
     */
    public function delete(?Comment $comment): Comment
    {
        if ($comment === null) {
            throw new ModelNotFoundException();
        }

        $comment->delete();

        return $comment;
    }
}
