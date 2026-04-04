<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;

// (TBH, this file looks garbled.)
// routes/web.php is like the URL map of your entire application.
// It tells Laravel "when user visits this URL, run this code".

Route::get('/me', function () {
	return response()->json([
		'authenticated' => auth()->guard()->check(),
		'user' => auth()->guard()->check() ? auth()->guard()->user() : null,
	]);
});

// Fetch all Users' posts
Route::get('/posts', function () {
	$posts = \App\Models\Post::with('user:id,name,display_name')->latest()->get();

	return response()->json($posts);
});

// Fetch a User's posts
Route::get('/users/{user}/posts', function (\App\Models\User $user) {
	// $user is instance of the current user
	return $user->usersPosts()	// the method you defined in App\Models\Post
		->latest()				// order them by the date
		->with('user:id,name,display_name')
		->get();				// get the relevant data
});

Route::get('/api/users/{user:name}', function (\App\Models\User $user) {
	return $user;
});

Route::get('/api/users/{user:name}/posts', function (\App\Models\User $user) {
	return $user->usersPosts()
		->with('user:id,name,display_name')
		->latest()
		->get();
});

Route::get('/api/posts/{post}', function (\App\Models\Post $post) {
	return $post->load('user:id,name,display_name');
});

// This uses a controller, read more about it here: https://laravel.com/docs/12.x/controllers
// Instead of passing a function as a second argument, you can pass an array containing:
// [Controller::class, 'methodName']
// This makes it reusable, instead of writing multiple inline functions doing the same thing.

// user-related
Route::post("/register", [UserController::class, 'register']);
Route::post("/login", [UserController::class, 'login']);
Route::post("/logout", [UserController::class, 'logout']);

// post-related
Route::post("/create-post", [PostController::class, 'createPost']);
// Laravel automatically finds Post by ID from URL
Route::get("/edit-post/{post}", [PostController::class, 'showEditScreen']);
Route::put("/edit-post/{post}", [PostController::class, 'updatePost']);
Route::delete("/delete-post/{post}", [PostController::class, 'deletePost']);

Route::get('/u/{user:name}', function () {
	return view('app');
});

Route::get('/u/{user:name}/{post}', function () {
	return view('app');
})->where('post', '[A-Za-z0-9_-]{1,15}');

// THIS NEEDS TO BE LAST
Route::get('/{any}', function () {
	return view('app');
})->where('any', '.*');