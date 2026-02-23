<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Models\Post;

Route::get('/', function () {
	// this returns posts for ALL users
	// $posts = Post::all();
	// only return posts for current logged in user
	// $posts = Post::where('user_id', auth()->guard()->id())->get();

	$posts = [];
	if (auth()->guard()->check()) {
		$posts = auth()->guard()->user()	// instance of the current user
			->usersPosts()					// the method you defined in App\Models\Post
			->latest()						// order them by the date
			->get();						// get the relevant data
	}
	return view('home', ['posts' => $posts]);
});

// this uses a controller, read more about it here:
// https://laravel.com/docs/12.x/controllers
// instead of passing a function as a second argument, you can pass an array containing:
// [Controller::class, 'functionName']

// user-related
Route::post("/register", [UserController::class, 'register']);
Route::post("/logout", [UserController::class, 'logout']);
Route::post("/login", [UserController::class, 'login']);

// post-related
Route::post("/create-post", [PostController::class, 'createPost']);
Route::get("/edit-post/{post}", [PostController::class, 'showEditScreen']);