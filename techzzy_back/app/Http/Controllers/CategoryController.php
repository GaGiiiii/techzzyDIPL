<?php

namespace App\Http\Controllers;

use App\Data\Category\CategoryData;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Http\Requests\Category\DeleteCategoryRequest;
use App\Http\Requests\Category\GetCategoriesRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\Category\CategoryResource;
use App\Models\Category;
use App\Services\Category\CategoryService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Validator;

class CategoryController extends Controller
{
    private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param GetCategoriesRequest $request
     * @return JsonResponse
     */
    public function index(GetCategoriesRequest $request)
    {
        try {
            $categories = $this->categoryService->getAll();
        } catch (QueryException $e) {
            return response()->json([
                "categories" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "categories" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "categories" => CategoryResource::collection($categories),
            "message" => "Categories found.",
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateCategoryRequest  $request
     * @return JsonResponse
     */
    public function store(CreateCategoryRequest $request)
    {
        try {
            $category = $this->categoryService->create(CategoryData::fromRequest($request));
        } catch (QueryException $e) {
            return response()->json([
                "category" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "category" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "category" => new CategoryResource($category),
            "message" => "Category created.",
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  GetCategoriesRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(GetCategoriesRequest $request, int $id)
    {
        try {
            $category = $this->categoryService->getById($id);
        } catch (QueryException $e) {
            return response()->json([
                "category" => null,
                "message" => "Server Error",
            ], 500);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "category" => null,
                "message" => "Category not found",
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "category" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "category" =>  new CategoryResource($category),
            "message" => "Category found",
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateCategoryRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(UpdateCategoryRequest $request, $id)
    {
        try {
            $category = $this->categoryService->update(CategoryData::fromRequest($request), $request->category);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "category" => null,
                "message" => "Category not found.",
            ], 404);
        } catch (Exception $e) {
            Log::debug([$e->getMessage()]);
        }

        return response([
            "category" => new CategoryResource($category),
            "message" => "Category updated.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  DeleteCategoryRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy(DeleteCategoryRequest $request, int $id)
    {
        try {
            $category = $this->categoryService->delete($request->category);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "category" => null,
                "message" => "Category not found.",
            ], 404);
        }

        return response([
            "category" => new CategoryResource($category),
            "message" => "Category deleted.",
        ], 200);
    }
}
