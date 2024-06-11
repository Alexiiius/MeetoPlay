<?php

namespace App\Http\Controllers;

/**
*
*@OA\Info(
*version="1.0",
*title="MeetoPlat API",
*description="All endpoints of the MeetoPlat API",
*@OA\Contact(name="Alejandro" , email="alexius1996@gmail.com")
*)
*
 * @OA\SecurityScheme(
 *     type="http",
 *     description="Use a JWT token received from the authentication API.",
 *     name="Bearer",
 *     in="header",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     securityScheme="Bearer"
 * )
 */
abstract class Controller
{
    //
}
