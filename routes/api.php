<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Post;

Route::get('/user', function (Request $request) {
	return $request->user();
});

Route::get('/posts', function () {
	if (!auth()->guard()->check())
		return [];
	return auth()->guard()->user()->usersPosts()->latest()->get();
});

Route::post('/posts', function (Request $request) {
	$data = $request->validate([
		'body' => ['required', 'max:400']
	]);

	$data['body'] = strip_tags($data['body']);
	$data['user_id'] = auth()->guard()->id();

	return Post::create($data);
});

Route::delete('/posts/{post}', function (Post $post) {
	if ($post->user_id !== auth()->guard()->id())
		abort(403);

	$post->delete();

	return ['success'=>true];
});

Route::put('/posts/{post}', function (Post $post, Request $request) {
	if ($post->user_id !== auth()->guard()->id())
		abort(403);

	$data = $request->validate([
		'body' => ['required', 'max:400']
	]);

	$post->update($data);

	return $post;
});
