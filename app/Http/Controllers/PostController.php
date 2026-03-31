<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

// The PostController handles all post-related web requests, (create, edit, update, delete).
class PostController extends Controller {
	// Generate Post ID.
	function generatePostId() {
		$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
		do {
			$id = '';
			for ($i = 0; $i < 15; $i++)
				$id .= $chars[random_int(0, strlen($chars) - 1)];
		} while (\App\Models\Post::where('id', $id)->exists());

		return $id;
	}

	// Create a new post.
	public function createPost(Request $request) {
		// Checks if 'body' is filled.
		// https://api.laravel.com/docs/12.x/Illuminate/Http/Request.html#method_validate
		$incomingFields = $request->validate([
			'body' => ['required', 'max:400']
		]);

		// Strip any potential HTML and PHP stuff the user might enter.
		// https://www.php.net/manual/en/function.strip-tags.php
		$incomingFields['body'] = strip_tags($incomingFields['body']);
		// use the current user's id as `user_id`
		$incomingFields['user_id'] = auth()->guard()->id();
		$incomingFields['id'] = $this->generatePostId();

		// Use Post model to create this field and save to database.
		// I think this is it here?
		// https://api.laravel.com/docs/12.x/Illuminate/Database/Eloquent/Builder.html#method_create
		$post = Post::create($incomingFields);

		// Return a response as a JSON.
		// https://laravel.com/docs/12.x/responses
		return response()->json(
			$post->load('user:id,name,display_name'),
			201
		);
	}

	// Shows the edit form, Laravel finds the post automatically by ID from the URL.
	public function showEditScreen(Post $post) {
		// To prevent unauthorized users entering this page (ex. not the author of this post),
		if (auth()->guard()->user()->id !== $post->user_id)
			// return a response that prevents them from accessing it.
			return response()->json(['message' => 'Forbidden'], 403);

		// Default status is 200.
		return response()->json($post);
	}

	// Saves edited posts.
	// $post is the post we're trying to update and $request gives us the incoming form data,
	// whatever the user typed in for their new values.
	public function updatePost(Post $post, Request $request) {
		if (auth()->guard()->user()->id !== $post->user_id)
			return response()->json(['message' => 'Forbidden'], 403);

		$incomingFields = $request->validate([
			'body' => ['required', 'max:400']
		]);

		$incomingFields['body'] = strip_tags($incomingFields['body']);

		// Update the post with the values provided.
		// https://api.laravel.com/docs/12.x/Illuminate/Database/Eloquent/Builder.html#method_update
		$post->update($incomingFields);

		return response()->json(
			$post->load('user:id,name,display_name')
		);
	}

	public function deletePost(Post $post) {
		if (auth()->guard()->user()->id !== $post->user_id)
			return response()->json(['message' => 'Forbidden'], 403);
		$post->delete();
		return response()->json(['message' => 'Deleted']);
	}
}
