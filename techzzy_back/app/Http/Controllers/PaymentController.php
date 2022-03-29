<?php

namespace App\Http\Controllers;

use App\Data\Payment\PaymentData;
use App\Http\Requests\Payment\CreatePaymentRequest;
use App\Http\Requests\Payment\GetPaymentsRequest;
use App\Http\Resources\Payment\PaymentResource;
use App\Models\Payment;
use App\Models\PaymentProduct;
use App\Models\Product;
use App\Models\ProductCart;
use App\Models\User;
use App\Services\Payment\PaymentService;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class PaymentController extends Controller
{

    private PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param GetPaymentsRequest
     * @return JsonResponse
     */
    public function index(GetPaymentsRequest $request)
    {
        try {
            $payments = $this->paymentService->getAll();
        } catch (QueryException $e) {
            return response()->json([
                "payments" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "payments" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "payments" => PaymentResource::collection($payments),
            "message" => "Payments found.",
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreatePaymentRequest $request
     * @return JsonResponse
     */
    public function store(CreatePaymentRequest $request)
    {
        try {
            $payment = $this->paymentService->create(PaymentData::fromRequest($request));
        } catch (QueryException $e) {
            return response()->json([
                "payment" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "payment" => null,
                "message" => "Server Error",
            ], 500);
        }
      
        return response([
            "payment" => new PaymentResource($payment),
            "payment2" => $request->products[0],
            "message" => "Payment created.",
        ], 201);
    }
}
