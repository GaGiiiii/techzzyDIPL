<?php

namespace App\Services\Rating;

use App\Data\Rating\RatingData;
use App\Models\Rating;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class RatingService
{

    /**
     * Retrieves all the categories.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return Rating::all();
    }

    /**
     * Retrieves single Rating.
     *
     * @param int $id
     * @return Rating
     * @throws ModelNotFoundException
     */
    public function getById(int $id): ?Rating
    {
        return Rating::findOrFail($id);
    }

    /**
     * Creates a new Rating.
     *
     * @param RatingData $ratingData
     * @return Rating
     */
    public function create(RatingData $ratingData): Rating
    {
        $rating = new Rating();
        $rating = $rating->create($ratingData->toArray());

        return $rating;
    }

    /**
     * Updates a existing Rating.
     *
     * @param RatingData $ratingData
     * @param Rating|null $rating
     * @return Rating
     * @throws ModelNotFoundException
     */
    public function update(RatingData $ratingData, ?Rating $rating): Rating
    {
        if ($rating === null) {
            throw new ModelNotFoundException();
        }

        $rating->update($ratingData->toArray());

        return $rating;
    }

    /**
     * Deletes a existing Rating.
     *
     * @param Rating $rating
     * @return Rating
     */
    public function delete(?Rating $rating): Rating
    {
        if ($rating === null) {
            throw new ModelNotFoundException();
        }

        $rating->delete();

        return $rating;
    }
}
