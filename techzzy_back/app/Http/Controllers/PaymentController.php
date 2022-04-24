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
use Illuminate\Support\Facades\Log;
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
            Log::debug($e->getMessage());
            Log::debug($e->getTrace());

            return response()->json([
                "payment" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            Log::debug($e->getMessage());
            Log::debug($e->getTrace());

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

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreatePaymentRequest $request
     * @return JsonResponse
     */
    public function nestpaySuccess(Request $request)
    {
        Log::debug($request);
        try {
            /*
                OID has 3 parts
                D*_PRODUCT_IDS_D*_USER_ID_D*_RANDOM_NUMBER
                _D*_1_2_33_4_D*_15_D*_45656
                After split: _D*_
                    ""
                    1_2_33_4
                    15
                    45656
            */
            $oid = $request->ReturnOid;
            $oidArr = explode('_D*_', $oid);
            $userID = $oidArr[2];

            $productIDs = explode('_', $oidArr[1]);
            $products = [];

            foreach ($productIDs as $pid) {
                array_push($products, ['id' => (int) $pid]);
            }

            $paymentData = new PaymentData([
                'user_id' => $userID,
                'order_id' => $oid,
                'price' => $request->amount,
                'type' => "NESTPAY",
                'nestpay_response' => json_encode($request->all()),
                'products' => $products,
            ]);
            $payment = $this->paymentService->create($paymentData);
        } catch (QueryException $e) {
            Log::debug($e->getMessage());
            Log::debug($e->getTrace());

            return response()->json([
                "payment" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            Log::debug($e->getMessage());
            Log::debug($e->getTrace());

            return response()->json([
                "payment" => null,
                "message" => "Server Error",
            ], 500);
        }

        return redirect('http://localhost:3000/cart');

        return response([
            "payment" => new PaymentResource($payment),
            "payment2" => $products[0],
            "message" => "Payment created.",
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreatePaymentRequest $request
     * @return JsonResponse
     */
    public function nestpayFail(Request $request)
    {
        Log::debug($request);
    }
}
