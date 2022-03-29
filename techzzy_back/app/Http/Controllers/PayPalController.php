<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PayPalController extends Controller
{

    private function getToken()
    {
        $clientID = env('PAYPAL_CLIENT_ID');
        $secret = env('PAYPAL_SECRET');
        $url = "https://api-m.sandbox.paypal.com/v1/oauth2/token";
        $data = "grant_type=client_credentials";
        $headers = [
        "Accept: application/json",
        "Accept-Language: en_US",
        ];

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, "$clientID:$secret");
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $result = json_decode(curl_exec($curl), true);
        curl_close($curl);

        return $result;
    }
}
