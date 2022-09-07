<?php

namespace App\Services\Category;

use App\Data\Category\CategoryData;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    /**
     * Retrieves all the categories.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return Category::with('products')->orderBy('created_at', 'DESC')->get();
    }

    /**
     * Retrieves single category.
     *
     * @param int $id
     * @return Category
     * @throws ModelNotFoundException
     */
    public function getById(int $id): ?Category
    {
        return Category::with('products')->findOrFail($id);
    }

    /**
     * Creates a new category.
     *
     * @param CategoryData $categoryData
     * @return Category
     */
    public function create(CategoryData $categoryData): Category
    {
        $category = new Category();
        $category = $category->create($categoryData->toArray());
        $category = $category->fresh(['products']);

        return $category;
    }

    /**
     * Updates a existing category.
     *
     * @param CategoryData $categoryData
     * @param Category|null $category
     * @return Category
     * @throws ModelNotFoundException
     */
    public function update(CategoryData $categoryData, ?Category $category): Category
    {
        if ($category === null) {
            throw new ModelNotFoundException();
        }

        $category->update($categoryData->toArray());

        return $category->fresh(['products']);
    }

    /**
     * Deletes a existing category.
     *
     * @param Category $category
     * @return Category
     */
    public function delete(?Category $category): Category
    {
        if ($category === null) {
            throw new ModelNotFoundException();
        }

        $category->delete();

        return $category;
    }
}
